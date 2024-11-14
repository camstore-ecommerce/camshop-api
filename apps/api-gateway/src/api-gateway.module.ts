import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ClientConfigService } from './client-config/client-config.service';
import { ClientConfigModule } from './client-config/client-config.module';
import { CategoriesModule } from './categories/categories.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { CdnService } from './cdn/cdn.service';
import { AddressesModule } from './addresses/addresses.module';

@Module({
	imports: [
		UsersModule,
		ProductsModule,
		ClientConfigModule,
		CategoriesModule,
		ManufacturersModule,
		LoggerModule.forRoot({
			pinoHttp: {
				transport: {
					target: 'pino-pretty',
					options: {
						singleLine: true,
					},
				},
			},
		}),
		AuthModule,
		OrdersModule,
		AddressesModule,
	],
	controllers: [ApiGatewayController],
	providers: [ApiGatewayService, ClientConfigService, CdnService],
})
export class ApiGatewayModule {}
