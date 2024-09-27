import {
	Body,
	Controller,
	Get,
	Post,
	Res,
	UseGuards,
	Query
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AdminLoginDto, ResetPasswordDto, UserLoginDto, UserRegisterDto } from '@app/contracts/auth';
import { JwtAuthGuard } from '@app/common/guards';
import { AuthUser } from '@app/common/decorators';
import { UserDto } from '@app/contracts/users';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('admin-login')
	async adminLogin(@Body() loginDto: AdminLoginDto, @Res({ passthrough: true }) response: Response) {
		const jwt = await this.authService.adminLogin(loginDto);
		response.cookie('Authentication', jwt.token, { httpOnly: true, expires: new Date(jwt.expires) });
		response.send(jwt.user);
	}

	@Post('login')
	async login(@Body() loginDto: UserLoginDto, @Res({ passthrough: true }) response: Response) {
		const jwt = await this.authService.login(loginDto);
		response.cookie('Authentication', jwt.token, { httpOnly: true, expires: new Date(jwt.expires) });
		response.send(jwt.user);
	}

	@Post('register')
	async register(@Body() registerDto: UserRegisterDto) {
		return await this.authService.register(registerDto);
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('Authentication');
		response.send({ message: 'Logged out successfully' });
	}

	@Get('status')
	@UseGuards(JwtAuthGuard)
	async status(@AuthUser() user: UserDto) {
		return user;
	}

	@Get('verify-email')
	@UseGuards(JwtAuthGuard)
	async sendVerifyEmail(@AuthUser() user: UserDto) {
		return await this.authService.sendVerifyEmail(user);
	}

	@Get('confirm-verify-email')
	async verify(@Query('token') token: string) {
		return await this.authService.confirmVerifyEmail(token);
	}

	@Post('forgot-password')
	async forgotPassword(@Body('email') email: string) {
		return await this.authService.forgotPassword(email);
	}

	@Post('reset-password')
	async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return await this.authService.resetPassword(resetPasswordDto);
	}
}
