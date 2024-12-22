import { Controller, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
	AdminLoginDto,
	AdminLoginResponse,
	AuthenticateResponse,
	AuthServiceController,
	AuthServiceControllerMethods,
	ConfirmVerifyEmailDto,
	ForgotPasswordDto,
	ResetPasswordDto,
	UserLoginDto,
	UserLoginResponse,
	UserRegisterDto,
	UserRegisterResponse,
	VerifyEmailDto,
} from '@app/contracts/auth';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '@app/contracts/users';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
	constructor(private readonly authService: AuthService) {}

	async adminLogin(adminLoginDto: AdminLoginDto): Promise<AdminLoginResponse> {
		return await this.authService.adminLogin(adminLoginDto);
	}

	async login(userLoginDto: UserLoginDto): Promise<UserLoginResponse> {
		return await this.authService.login(userLoginDto);
	}

	async register(registerDto: UserRegisterDto): Promise<UserRegisterResponse> {
		return await this.authService.register(registerDto);
	}

	@UseGuards(JwtAuthGuard)
	async authenticate(data: any): Promise<AuthenticateResponse> {
		return { user: data.user as User };
	}

	verifyEmail(user: VerifyEmailDto) {
		return this.authService.sendVerificationEmail(user);
	}

	async confirmVerifyEmail(confirmVerifyEmailDto: ConfirmVerifyEmailDto) {
		return await this.authService.verifyEmail(confirmVerifyEmailDto.token);
	}

	async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
		return await this.authService.forgotPassword(forgotPasswordDto.email);
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		return await this.authService.resetPassword(resetPasswordDto);
	}
}
