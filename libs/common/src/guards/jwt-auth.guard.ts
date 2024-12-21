import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	OnModuleInit,
	UnauthorizedException,
} from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { USERS_CLIENT } from '../constants/services';
import { ClientGrpc } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '@app/contracts/auth';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
	private readonly logger = new Logger(JwtAuthGuard.name);
	private authServiceClient: AuthServiceClient;
	constructor(
		@Inject(USERS_CLIENT) private readonly usersClient: ClientGrpc,
		private readonly reflector: Reflector,
	) {
		this.logger.log('JwtAuthGuard initialized');
	}

	onModuleInit() {
		this.authServiceClient =
			this.usersClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
	}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		
		const request = context.switchToHttp().getRequest();
		const jwt =
		request.cookies?.Authentication || request.headers?.authentication;
		
		if (isPublic && !jwt) {
			return true;
		}

		if (!jwt) {
			return false;
		}

		const role = this.reflector.get<string>('role', context.getHandler());

		return this.authServiceClient.authenticate({ Authentication: jwt }).pipe(
			tap((res) => {
				if (role && res.user.role !== role) {
					this.logger.error('The user does not have valid roles.');
					throw new UnauthorizedException();
				}
				context.switchToHttp().getRequest().user = res.user;
			}),
			map(() => true),
			catchError((err) => {
				this.logger.error(err);
				return of(false);
			}),
		);
	}
}
