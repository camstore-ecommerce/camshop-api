import {
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
	AdminLoginDto,
	ResetPasswordDto,
	UserLoginDto,
	UserRegisterDto,
	VerifyEmailDto,
} from '@app/contracts/auth';
import { UsersService } from '../users/users.service';
import { AdminTokenPayload, UserTokenPayload } from '@app/common/interfaces';
import { ClientProxy } from '@nestjs/microservices';
import { VerificationService } from '../verification/verification.service';
import { MAIL_PATTERNS } from '@app/contracts/mail';
import * as jwt from 'jsonwebtoken';
import { MAIL_CLIENT } from '@app/common/constants/services';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly verificationService: VerificationService,
		@Inject(MAIL_CLIENT) private readonly mailClient: ClientProxy,
	) {}

	async adminLogin(loginDto: AdminLoginDto) {
		const user = await this.usersService.validateAdmin(
			loginDto.username,
			loginDto.password,
		);

		if (!user) {
			throw new UnauthorizedException();
		}

		const tokenPayload: AdminTokenPayload = {
			username: user.username,
			role: user.role,
			sub: user.id,
		};
		const expires = new Date();
		expires.setSeconds(
			expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
		);
		const token = await this.jwtService.signAsync(tokenPayload);
		return { token, expires, user };
	}

	async login(loginDto: UserLoginDto) {
		const user = await this.usersService.validateUser(
			loginDto.email,
			loginDto.password,
		);

		if (!user) {
			throw new UnauthorizedException();
		}

		const tokenPayload: UserTokenPayload = {
			email: user.email,
			role: user.role,
			sub: user.id,
		};
		const expires = new Date();
		expires.setSeconds(
			expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
		);

		const token = await this.jwtService.signAsync(tokenPayload);

		return { token, expires, user };
	}

	async register(registerDto: UserRegisterDto) {
		const user = await this.usersService.registerUser(registerDto);
		this.sendVerificationEmail(user);
		return {
			message:
				'User registered. Please check your email to verify your account.',
			user,
		};
	}

	async sendVerificationEmail(user: VerifyEmailDto) {
		if (user.verified_email_at) {
			throw new UnauthorizedException('User already verified');
		}

		const otp = await this.verificationService.generateOtpCode(user.id);

		const token = jwt.sign(
			{ user: user.email, otp },
			this.configService.get('JWT_SECRET'),
			{ expiresIn: '1h' },
		);

		await firstValueFrom(
			this.mailClient.send(MAIL_PATTERNS.SEND, {
				subject: 'Email Verification',
				recipients: [
					{ name: `${user.first_name} ${user.last_name}`, address: user.email },
				],
				html: `<p>Click <a href="${this.configService.get('APP_URL')}/confirm-verify-email?token=${token}">here</a> to verify your email</p>`,
			}),
		);

		return { message: 'Please check your email to verify your account.' };
	}

	async verifyEmail(token: string) {
		try {
			const decoded = jwt.verify(
				token,
				this.configService.get('JWT_SECRET'),
			) as { user: string; otp: string };

			const user = await this.usersService.findOne(decoded.user);

			if (!user) {
				throw new UnauthorizedException('User not found');
			}

			const isValid = await this.verifyOtp(user.id, decoded.otp);

			if (!isValid) {
				throw new UnauthorizedException('Invalid or expired OTP');
			}

			user.verified_email_at = new Date();
			user.status = 'active';
			await this.usersService.update(user.id, user);

			return { message: 'Email verified successfully' };
		} catch (err) {
			console.log(err);
			throw new HttpException(
				'Invalid or expired token',
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	async generateOtp(userId: string) {
		const user = await this.usersService.findOne(userId);

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		if (user.verified_email_at) {
			throw new UnauthorizedException('User already verified');
		}

		const otp = await this.verificationService.generateOtpCode(user.id);

		this.mailClient.send(MAIL_PATTERNS.SEND, {
			subject: 'OTP Verification',
			recipients: [
				{ name: `${user.first_name} ${user.last_name}`, address: user.email },
			],
			html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
		});
	}

	async verifyOtp(userId: string, token: string) {
		const user = await this.usersService.findOne(userId);

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		if (user.verified_email_at) {
			throw new UnauthorizedException('User already verified');
		}

		const isValid = await this.verificationService.validateOtp(user.id, token);

		if (!isValid) {
			throw new UnauthorizedException('Invalid or Expired OTP');
		}

		return true;
	}

	async forgotPassword(email: string) {
		const user = await this.usersService.findOne(email);

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		const otp = await this.verificationService.generateOtpCode(user.id);

		const token = jwt.sign(
			{ user: user.email, otp },
			this.configService.get('JWT_SECRET'),
			{ expiresIn: '1h' },
		);

		await firstValueFrom(
			this.mailClient.send(MAIL_PATTERNS.SEND, {
				subject: 'Reset Password',
				recipients: [
					{ name: `${user.first_name} ${user.last_name}`, address: user.email },
				],
				html: `<p>Click <a href="${this.configService.get('APP_URL')}/reset-password?token=${token}">here</a> to reset your password</p>`,
			}),
		);

		return { message: 'Please check your email to reset your password' };
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		try {
			const decoded = jwt.verify(
				resetPasswordDto.token,
				this.configService.get('JWT_SECRET'),
			) as { user: string; otp: string };

			const user = await this.usersService.findOne(decoded.user);

			if (!user) {
				throw new UnauthorizedException('User not found');
			}

			const isValid = await this.verifyOtp(user.id, decoded.otp);

			if (!isValid) {
				throw new UnauthorizedException('Invalid or expired OTP');
			}

			user.password = resetPasswordDto.password;
			await this.usersService.update(user.id, user);

			return { message: 'Password reset successfully' };
		} catch (err) {
			console.log(err);
			throw new HttpException(
				'Invalid or expired token',
				HttpStatus.BAD_REQUEST,
			);
		}
	}
}
