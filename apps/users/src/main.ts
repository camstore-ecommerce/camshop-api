import { NestFactory } from '@nestjs/core';
import { UsersAppModule } from './users-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { USERS_PACKAGE_NAME } from '@app/contracts/users';
import { USERS_PATH } from '@app/common/constants/proto-path';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		UsersAppModule,
		{
			transport: Transport.GRPC,
			options: {
				package: USERS_PACKAGE_NAME,
				protoPath: USERS_PATH,
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
	console.log(`Users microservice is listening on port: ${process.env.PORT}`);
}
bootstrap();
