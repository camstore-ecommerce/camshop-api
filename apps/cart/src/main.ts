import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CartAppModule } from './cart-app.module';
import { CART_PACKAGE_NAME } from '@app/contracts/cart';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		CartAppModule,
		{
			transport: Transport.GRPC,
			options: {
				package: CART_PACKAGE_NAME,
				protoPath: ['proto/cart/cart.proto'],
				url: process.env.GRPC_URL,
				loader: {
					keepCase: true,
					longs: String,
					enums: String,
					defaults: true,
					oneofs: true,
					objects: true,
				},
			},
		}
	);
	await app.listen();
	console.log(`Cart microservice is listening on port: ${process.env.PORT}`);
}
bootstrap();
