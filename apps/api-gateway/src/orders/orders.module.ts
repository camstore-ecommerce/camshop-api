import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ORDERS_CLIENT, USERS_CLIENT } from '@app/common/constants/services';
import { ClientConfigService } from '../client-config/client-config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigModule } from '../client-config/client-config.module';

@Module({
	imports: [ClientConfigModule],
	controllers: [OrdersController],
	providers: [
		OrdersService,
		{
			provide: ORDERS_CLIENT,
			useFactory: (configService: ClientConfigService) => {
				const clientOptions = configService.ordersClientOption;
				return ClientProxyFactory.create(clientOptions);
			},
			inject: [ClientConfigService],
		},
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
export class OrdersModule {}
