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
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
	imports: [
		UsersModule,
		ProductsModule,
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./apps/api-gateway/${process.env.NODE_ENV === 'development' ? '.env.dev' : '.env'}`,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision', 'staging')
					.default('development'),
				PORT: Joi.number().default(3001),
				PRODUCTS_CLIENT_PORT: Joi.number(),
				USERS_CLIENT_PORT: Joi.number(),
				ORDERS_CLIENT_PORT: Joi.number(),
			}),
			validationOptions: {
				abortEarly: true,
			},
			cache: true,
			expandVariables: true,
		}),
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
		CartModule,
	],
	controllers: [ApiGatewayController],
	providers: [ApiGatewayService, ClientConfigService, CdnService],
})
export class ApiGatewayModule {}
