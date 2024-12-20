import { NestFactory } from '@nestjs/core';
import { ProductsAppModule } from './products-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PRODUCTS_PACKAGE_NAME } from '@app/contracts/products';
import { PRODUCTS_PATH } from '@app/common/constants/proto-path';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		ProductsAppModule,
		{
			transport: Transport.GRPC,
			options: {
				package: PRODUCTS_PACKAGE_NAME,
				protoPath: PRODUCTS_PATH,
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
