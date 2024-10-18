import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AdminTokenPayload, UserTokenPayload } from '@app/common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private readonly userService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: any) =>
					request?.cookies?.Authentication ||
					request?.Authentication ||
					request?.headers.Authentication,
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
		});
	}

	async validate(payload: UserTokenPayload | AdminTokenPayload) {
		try {
			if (payload.role === 'admin') {
				const user = await this.userService.findAdmin(payload.sub);
				if (!user) {
					throw new UnauthorizedException('Invalid token');
				}
				const { password, ...result } = user;
				return result;
			}
			const user = await this.userService.findOne(payload.sub);
			if (!user) {
				throw new UnauthorizedException('Invalid token');
			}
			const { password, created_at, updated_at, deleted_at, ...result } = user;
			return result;
		} catch (error) {
			console.error('Error validating JWT:', error);
			throw new UnauthorizedException('Invalid token');
		}
	}
}
