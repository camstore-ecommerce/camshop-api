import { NestFactory } from '@nestjs/core';
import { OrdersAppModule } from './orders-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ORDERS_PACKAGE_NAME } from '@app/contracts/orders';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		OrdersAppModule,
		{
			transport: Transport.GRPC,
			options: {
				package: ORDERS_PACKAGE_NAME,
				protoPath: ['proto/orders/orders.proto'],
				url: process.env.GRPC_URL || '0.0.0.0:50053',
				loader: {
					keepCase: true,
					longs: String,
					enums: String,
					defaults: true,
					oneofs: true,
				},
			},
		},
	);
	await app.listen();
	console.log(`Order microservice is listening on port: ${process.env.PORT}`);
}
bootstrap();
