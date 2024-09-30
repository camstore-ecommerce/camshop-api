import { NestFactory } from '@nestjs/core';
import { ProductsAppModule } from './products-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		ProductsAppModule,
		{
			transport: Transport.TCP,
			options: {
				host: '0.0.0.0',
				port: parseInt(process.env.PORT, 10),
			},
		},
	);
	await app.listen();
	console.log(`Products microservice is running on port: ${process.env.PORT}`);
}
bootstrap();
