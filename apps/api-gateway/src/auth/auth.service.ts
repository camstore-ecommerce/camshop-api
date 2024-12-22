import { USERS_CLIENT } from '@app/common/constants/services';
import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import {
	AdminLoginDto,
	AUTH_SERVICE_NAME,
	AuthServiceClient,
	ResetPasswordDto,
	UserLoginDto,
	UserRegisterDto,
	VerifyEmailDto,
} from '@app/contracts/auth';

@Injectable()
export class AuthService implements OnModuleInit {
	private authServiceClient: AuthServiceClient;

	constructor(@Inject(USERS_CLIENT) private readonly usersClient: ClientGrpc) {}

	onModuleInit() {
		this.authServiceClient =
			this.usersClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
	}

	async login(userLoginDto: UserLoginDto) {
		return await firstValueFrom(this.authServiceClient.login(userLoginDto));
	}

	async register(userRegisterDto: UserRegisterDto) {
		return await firstValueFrom(
			this.authServiceClient.register(userRegisterDto),
		);
	}

	async adminLogin(adminLoginDto: AdminLoginDto) {
		return await firstValueFrom(
			this.authServiceClient.adminLogin(adminLoginDto),
		);
	}

	async sendVerifyEmail(user: VerifyEmailDto) {
		return await firstValueFrom(this.authServiceClient.verifyEmail(user).pipe(
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			}),
		));
	}

	async confirmVerifyEmail(token: string) {
		return await firstValueFrom(
			this.authServiceClient.confirmVerifyEmail({ token }).pipe(
				catchError((error) => {
					return throwError(() => new BadRequestException(error.message));
				}),
			)
		);
	}

	async forgotPassword(email: string) {
		return await firstValueFrom(
			this.authServiceClient.forgotPassword({ email }),
		);
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		return await firstValueFrom(
			this.authServiceClient.resetPassword(resetPasswordDto),
		);
	}
}
