import { NestFactory } from '@nestjs/core';
import { UsersAppModule } from './users-app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { USERS_PACKAGE_NAME } from '@app/contracts/users';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		UsersAppModule,
		{
			transport: Transport.GRPC,
			options: {
				package: USERS_PACKAGE_NAME,
				protoPath: ['proto/users/users.proto', 'proto/users/auth.proto'],
				url: process.env.GRPC_URL || '0.0.0.0:50052',
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
	console.log(`User microservice is listening on port: ${process.env.PORT}`);
}
bootstrap();
