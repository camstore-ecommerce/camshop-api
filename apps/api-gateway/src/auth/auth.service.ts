import { USERS_CLIENT } from '@app/common/constants/services';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AdminLoginDto, AUTH_PATTERNS, ResetPasswordDto, UserLoginDto, UserRegisterDto } from '@app/contracts/auth';
import { UserDto } from '@app/contracts/users';

@Injectable()
export class AuthService {
	constructor(
		@Inject(USERS_CLIENT) private readonly userClient: ClientProxy,
	) { }

	async login(loginDto: UserLoginDto) {
		return await firstValueFrom(this.userClient.send(AUTH_PATTERNS.USER_LOGIN, loginDto));
	}

	async register(registerDto: UserRegisterDto) {
		return await firstValueFrom(this.userClient.send(AUTH_PATTERNS.USER_REGISTER, registerDto));
	}

	async adminLogin(loginDto: AdminLoginDto) {
		return await firstValueFrom(this.userClient.send(AUTH_PATTERNS.ADMIN_LOGIN, loginDto));
	}

	async sendVerifyEmail(user: UserDto) {
		return await firstValueFrom(this.userClient.send(AUTH_PATTERNS.EMAIL_VERIFICATION, user));
	}

	async confirmVerifyEmail(token: string) {
		return await firstValueFrom(this.userClient.send(AUTH_PATTERNS.EMAIL_VERIFICATION_CONFIRM, token));
	}

	async forgotPassword(email: string) {
		return await firstValueFrom(this.userClient.send(AUTH_PATTERNS.FORGOT_PASSWORD, email));
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		return await firstValueFrom(this.userClient.send(AUTH_PATTERNS.RESET_PASSWORD, resetPasswordDto));
	}
}