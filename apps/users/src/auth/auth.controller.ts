import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminLoginDto, AUTH_PATTERNS, ResetPasswordDto, UserLoginDto, UserRegisterDto } from '@app/contracts/auth';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserDto } from '@app/contracts/users';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService) { }

  @MessagePattern(AUTH_PATTERNS.ADMIN_LOGIN)
  async adminLogin(@Payload() loginDto: AdminLoginDto) {
    return await this.authService.adminLogin(loginDto);
  }

  @MessagePattern(AUTH_PATTERNS.USER_LOGIN)
  async login(@Payload() loginDto: UserLoginDto) {
    return await this.authService.login(loginDto);
  }

  @MessagePattern(AUTH_PATTERNS.USER_REGISTER)
  async register(@Payload() registerDto: UserRegisterDto) {
    return await this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern(AUTH_PATTERNS.AUTHENTICATE)
  async authenticate(@Payload() data: any) {
    return data.user;
  }

  @MessagePattern(AUTH_PATTERNS.EMAIL_VERIFICATION)
  async verifyEmail(@Payload() user: UserDto) {
    return await this.authService.sendVerificationEmail(user);
  }

  @MessagePattern(AUTH_PATTERNS.EMAIL_VERIFICATION_CONFIRM)
  async confirmVerifyEmail(@Payload() token: string) {
    return await this.authService.verifyEmail(token);
  }

  @MessagePattern(AUTH_PATTERNS.FORGOT_PASSWORD)
  async forgotPassword(@Payload() email: string) {
    return await this.authService.forgotPassword(email);
  }

  @MessagePattern(AUTH_PATTERNS.RESET_PASSWORD)
  async resetPassword(@Payload() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}
