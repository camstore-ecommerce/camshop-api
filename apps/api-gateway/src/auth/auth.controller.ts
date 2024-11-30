import {
	Body,
	Controller,
	Get,
	Post,
	Res,
	UseGuards,
	Query,
	BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
	AdminLoginDto,
	ResetPasswordDto,
	UserLoginDto,
	UserRegisterDto,
} from '@app/contracts/auth';
import { JwtAuthGuard } from '@app/common/guards';
import { AuthUser } from '@app/common/decorators';
import { Admin, UserDto } from '@app/contracts/users';
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RpcException } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('admin-login')
	@ApiOperation({ summary: 'Admin login' })
	@ApiResponse({ status: 200, description: 'Admin login', type: Admin })
	async adminLogin(
		@Body() loginDto: AdminLoginDto,
		@Res({ passthrough: true }) response: Response,
	) {
		const jwt = await this.authService.adminLogin(loginDto);
		response.cookie('Authentication', jwt.token, {
			httpOnly: true,
			expires: new Date(jwt.expires),
		});
		response.send(jwt.user);
	}

	@Post('login')
	@ApiOperation({ summary: 'User login' })
	@ApiBody({
		description: 'User login data',
		type: UserLoginDto,
		examples: {
			a: {
				summary: 'Example Admin Login',
				value: { email: 'davicmax123@gmail.com', password: '1234567' }
			}
		}
	})
	@ApiResponse({ status: 200, description: 'User login', type: UserDto })
	async login(
		@Body() loginDto: UserLoginDto,
		@Res({ passthrough: true }) response: Response,
	) {
		const jwt = await this.authService.login(loginDto);
		response.cookie('Authentication', jwt.token, {
			httpOnly: true,
			expires: new Date(jwt.expires),
		});
		response.setHeader('Content-Type', 'application/json');
		response.send(jwt.user);
	}

	@Post('register')
	@ApiOperation({ summary: 'User register' })
	@ApiResponse({ status: 201, description: 'User register', type: UserDto })
	async register(@Body() registerDto: UserRegisterDto) {
		return await this.authService.register(registerDto);
	}

	@Post('logout')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Logout' })
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie('Authentication');
		response.send({ message: 'Logged out successfully' });
	}

	@Get('status')
	@UseGuards(JwtAuthGuard)
	@ApiOperation({ summary: 'Get logged in user status' })
	@ApiResponse({ status: 200, description: 'User status', type: UserDto })
	async status(@AuthUser() user: UserDto) {
		return user;
	}

	@Get('verify-email')
	@ApiOperation({ summary: 'Send verify email to logged in user' })
	@UseGuards(JwtAuthGuard)
	async sendVerifyEmail(@AuthUser() user: UserDto) {
		if (user.role === 'user') {
			return await this.authService.sendVerifyEmail(user);
		}

		return { message: 'Only users can verify email' };

	}

	@Get('confirm-verify-email')
	@ApiOperation({ summary: 'Confirm verify email', description: 'Confirm verify email using token from mail' })
	async verify(@Query('token') token: string) {
		return await this.authService.confirmVerifyEmail(token);
	}

	@ApiExcludeEndpoint()
	@Post('forgot-password')
	async forgotPassword(@Body('email') email: string) {
		return await this.authService.forgotPassword(email);
	}

	@ApiExcludeEndpoint()
	@Post('reset-password')
	async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return await this.authService.resetPassword(resetPasswordDto);
	}
}
