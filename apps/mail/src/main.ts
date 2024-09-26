import { NestFactory } from '@nestjs/core';
import { MailModule } from './mail.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		MailModule,
		{
			transport: Transport.TCP,
			options: {
				port: parseInt(process.env.PORT, 10),
			},
		},
	);
	await app.listen();
	console.log(`Mail microservice is listening on port: ${process.env.PORT}`);
}
bootstrap();
