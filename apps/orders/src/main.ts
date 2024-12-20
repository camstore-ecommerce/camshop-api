import { NestFactory } from '@nestjs/core';
import { OrdersAppModule } from './orders-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ORDERS_PACKAGE_NAME } from '@app/contracts/orders';
import { ORDERS_PATH } from '@app/common/constants/proto-path';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		OrdersAppModule,
		{
			transport: Transport.GRPC,
			options: {
				package: ORDERS_PACKAGE_NAME,
				protoPath: ORDERS_PATH,
				url: process.env.GRPC_URL,
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
