import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `./apps/mail/${process.env.NODE_ENV === 'development' ? '.env.dev' : '.env'}`,
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision', 'staging')
					.default('development'),
				PORT: Joi.number(),
				MAIL_USER: Joi.string().required(),
				MAIL_PASSWORD: Joi.string().required(),
				MAIL_SENDER_NAME_DEFAULT: Joi.string().required(),
				MAIL_SENDER_DEFAULT: Joi.string().required(),
				MAIL_HOST: Joi.string().required(),
				MAIL_PORT: Joi.number().required(),
			}),
			validationOptions: {
				abortEarly: true,
			},
			cache: true,
			expandVariables: true,
		}),
	],
	controllers: [MailController],
	providers: [MailService],
})
export class MailModule {}
