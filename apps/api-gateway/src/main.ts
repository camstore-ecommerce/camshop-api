import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
	const app = await NestFactory.create(ApiGatewayModule);
	app.setGlobalPrefix('api');
	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe());
	app.useLogger(app.get(Logger));
	app.use(helmet());
	app.enableCors();
	const config_service = app.get(ConfigService);
	await app.listen(config_service.get('PORT'), () => {
		console.log(
			`API Gateway is running on port: ${config_service.get('PORT')}`,
			`in ${config_service.get('NODE_ENV')} mode`,
		);
	});
}
bootstrap();
