import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { VerificationModule } from './verification/verification.module';
import { AddressesModule } from './addresses/addresses.module';
import { UsersRedisModule } from './redis/users-redis.module';
import * as Joi from 'joi';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./apps/users/${process.env.NODE_ENV === 'development' ? '.env.dev' : '.env'}`,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision', 'staging')
					.default('development'),
				PORT: Joi.number(),
				DATABASE_URL: Joi.string().required(),
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION: Joi.number().required(),
				MAIL_CLIENT_PORT: Joi.number().required(),
				APP_URL: Joi.string().required(),
			}),
			validationOptions: {
				abortEarly: true,
			},
			cache: true,
			expandVariables: true,
		}),
		UsersModule,
		AuthModule,
		VerificationModule,
		AddressesModule,
		UsersRedisModule,
	],
	controllers: [],
	providers: [],
})
export class UsersAppModule {}
