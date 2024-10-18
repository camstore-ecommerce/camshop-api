import { Module } from '@nestjs/common';
import { ClientConfigService } from './client-config.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
	imports: [
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
		}),
	],
	providers: [ClientConfigService],
	exports: [ClientConfigService],
})
export class ClientConfigModule {}
