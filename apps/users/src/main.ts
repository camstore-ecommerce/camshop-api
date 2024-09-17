import { NestFactory } from '@nestjs/core';
import { UsersAppModule } from './users-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		UsersAppModule,
		{
			transport: Transport.TCP,
			options: {
				port: parseInt(process.env.PORT, 10),
			},
		},
	);
	await app.listen();
	console.log(`User microservice is listening on port: ${process.env.PORT}`);
}
bootstrap();
