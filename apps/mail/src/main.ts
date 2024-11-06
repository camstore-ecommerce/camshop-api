import { NestFactory } from '@nestjs/core';
import { MailModule } from './mail.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		MailModule,
		{
			transport: Transport.RMQ,
			options: {
				urls: [process.env.RMQ_URL || 'amqp://localhost:5672'],
				queue: 'mail_queue',
				queueOptions: {
					durable: false,
				},
			},
		},
	);
	await app.listen();
	console.log(`Mail microservice is listening on port: ${process.env.PORT}`);
}
bootstrap();
