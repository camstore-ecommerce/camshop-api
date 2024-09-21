import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminLoginDto, AUTH_PATTERNS, UserLoginDto, UserRegisterDto } from '@app/contracts/auth';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
}