import { NestFactory } from '@nestjs/core';
import { ProductsAppModule } from './products-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PRODUCTS_PACKAGE_NAME } from '@app/contracts/products';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		ProductsAppModule,
		{
			transport: Transport.GRPC,
			options: {
				package: PRODUCTS_PACKAGE_NAME,
				protoPath: [
					'proto/products/products.proto',
					'proto/products/manufacturers.proto',
					'proto/products/categories.proto',
					'proto/products/inventory.proto',
				],
				url: process.env.GRPC_URL,
				loader: {
					keepCase: true,
					longs: String,
					enums: String,
					oneofs: true,
				},
			},
		},
	);
	await app.listen();
	console.log(`Products microservice is running on port: ${process.env.PORT}`);
}
bootstrap();
