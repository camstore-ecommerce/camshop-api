import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { USERS_CLIENT } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { AUTH_PATTERNS } from '@app/contracts/auth';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	private readonly logger = new Logger(JwtAuthGuard.name);

	constructor(
		@Inject(USERS_CLIENT) private readonly userClient: ClientProxy,
		private readonly reflector: Reflector,
	) {
		this.logger.log('JwtAuthGuard initialized');
	}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		const jwt =
			context.switchToHttp().getRequest().cookies?.Authentication ||
			context.switchToHttp().getRequest().headers?.authentication;

		if (!jwt) {
			return false;
		}

		const role = this.reflector.get<string>('role', context.getHandler());

		return this.userClient
			.send(AUTH_PATTERNS.AUTHENTICATE, {
				Authentication: jwt,
			})
			.pipe(
				tap((res) => {
					if (role && res.role !== role) {
						this.logger.error('The user does not have valid roles.');
						throw new UnauthorizedException();
					}
					context.switchToHttp().getRequest().user = res;
				}),
				map(() => true),
				catchError((err) => {
					this.logger.error(err);
					return of(false);
				}),
			);
	}
}
