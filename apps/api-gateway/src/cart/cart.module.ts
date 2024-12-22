import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ClientConfigModule } from '../client-config/client-config.module';
import { ClientConfigService } from '../client-config/client-config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { USERS_CLIENT } from '@app/common/constants/services';

@Module({
  imports: [ClientConfigModule],
  controllers: [CartController],
  providers: [
    CartService,
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
export class CartModule {}
