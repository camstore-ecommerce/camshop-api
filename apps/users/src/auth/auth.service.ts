import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto, UserLoginDto, UserRegisterDto } from '@app/contracts/auth';
import { UsersService } from '../users/users.service';
import { AdminTokenPayload, UserTokenPayload } from '@app/common/interfaces';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) { }

    async adminLogin(loginDto: AdminLoginDto) {
        const user = await this.usersService.validateAdmin(loginDto.username, loginDto.password);

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
        )
        const { password,...result } = user;
        const token = await this.jwtService.signAsync(tokenPayload);

        return { token, expires, user: result };
    }

    async login(loginDto: UserLoginDto) {
        const user = await this.usersService.validateUser(loginDto.email, loginDto.password);

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
        )
        const { password, created_at, updated_at, deleted_at,...result } = user;
        const token = await this.jwtService.signAsync(tokenPayload);

        return { token, expires, user: result };
    }

    async register(registerDto: UserRegisterDto) {
        return await this.usersService.registerUser(registerDto);
    }
}
