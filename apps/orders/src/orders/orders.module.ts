import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../prisma.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { PRODUCTS_CLIENT, USERS_CLIENT } from '@app/common/constants/services';
import { ClientConfigService } from '../client-config/client-config.service';
import { ClientConfigModule } from '../client-config/client-config.module';

@Module({
	imports: [ClientConfigModule],
	controllers: [OrdersController],
	providers: [
		OrdersService,
		PrismaService,
		{
			provide: PRODUCTS_CLIENT,
			useFactory: (configService: ClientConfigService) => {
				const clientOptions = configService.productsClientOption;
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
