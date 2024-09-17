import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

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
				POSTGRES_HOST: Joi.string().required(),
				POSTGRES_PORT: Joi.number().required(),
				POSTGRES_USER: Joi.string().required(),
				POSTGRES_PASSWORD: Joi.string().required(),
				POSTGRES_DB: Joi.string().required(),
			}),
			validationOptions: {
				abortEarly: true,
			},
			cache: true,
			expandVariables: true,
		}),
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.getOrThrow('POSTGRES_HOST'),
				port: configService.getOrThrow('POSTGRES_PORT'),
				username: configService.getOrThrow('POSTGRES_USER'),
				password: configService.getOrThrow('POSTGRES_PASSWORD'),
				database: configService.getOrThrow('POSTGRES_DB'),
				synchronize: true,
				autoLoadEntities: true,
			}),
			inject: [ConfigService],
		}),
		UsersModule,
		AuthModule,
	],
	controllers: [],
	providers: [],
})
export class UsersAppModule {}
