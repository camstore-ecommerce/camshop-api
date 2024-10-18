import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { USERS_CLIENT } from '@app/common/constants/services';
import { ClientConfigService } from '../client-config/client-config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigModule } from '../client-config/client-config.module';

@Module({
	imports: [ClientConfigModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		{
			provide: USERS_CLIENT,
			useFactory: (configService: ClientConfigService) => {
				const clientOptions = configService.usersClientOption;
				return ClientProxyFactory.create(clientOptions);
			},
			inject: [ClientConfigService],
		},
	],
})
export class AuthModule {}
