import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import * as Joi from 'joi';
import { ClientConfigModule } from './client-config/client-config.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./apps/orders/${process.env.NODE_ENV === 'development' ? '.env.dev' : '.env'}`,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision', 'staging')
					.default('development'),
				PORT: Joi.number(),
				DATABASE_URL: Joi.string().required(),
			}),
			validationOptions: {
				abortEarly: true,
			},
			cache: true,
			expandVariables: true,
		}),
		OrdersModule,
		ClientConfigModule,
	],
	controllers: [],
	providers: [],
})
export class OrdersAppModule {}
