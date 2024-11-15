import { PRODUCTS_PACKAGE_NAME } from '@app/contracts/products';
import { USERS_PACKAGE_NAME } from '@app/contracts/users';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
	constructor(private configService: ConfigService) {}

	get productsClientOption(): ClientOptions {
		return {
			transport: Transport.GRPC,
			options: {
				package: PRODUCTS_PACKAGE_NAME,
				protoPath: [
					'proto/products/products.proto',
					'proto/products/manufacturers.proto',
					'proto/products/categories.proto',
				],
				url: this.configService.get('PRODUCTS_CLIENT_URL') || '0.0.0.0:50051',
				loader: {
					keepCase: true,
					longs: String,
					enums: String,
					defaults: true,
					oneofs: true,
				},
			},
		};
	}

	get usersClientOption(): ClientOptions {
		return {
			transport: Transport.GRPC,
			options: {
				package: USERS_PACKAGE_NAME,
				protoPath: [
					'proto/users/users.proto', 
					'proto/users/auth.proto',
					'proto/users/addresses.proto',
				],
				url: this.configService.get('USERS_CLIENT_URL') || '0.0.0.0:50052',
				loader: {
					keepCase: true,
					longs: String,
					enums: String,
					defaults: true,
					oneofs: true,
				},
			},
		};
	}
}
