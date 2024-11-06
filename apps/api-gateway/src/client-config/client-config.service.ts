import { PRODUCTS_PACKAGE_NAME } from '@app/contracts/products';
import { USERS_PACKAGE_NAME } from '@app/contracts/users';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
	constructor(private configService: ConfigService) {}

	getCdnCloudName(): string {
		return this.configService.get<string>('CDN_CLOUD_NAME');
	}

	getCdnApiKey(): string {
		return this.configService.get<string>('CDN_API_KEY');
	}

	getCdnApiSecret(): string {
		return this.configService.get<string>('CDN_API_SECRET');
	}

	getUsersClientPort(): number {
		return this.configService.get<number>('USERS_CLIENT_PORT');
	}

	getOrdersClientPort(): number {
		return this.configService.get<number>('ORDERS_CLIENT_PORT');
	}

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
					defaults: true,
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
					'proto/users/auth.proto'
				],
				url: this.configService.get('USERS_CLIENT_URL') || '0.0.0.0:50052',
				loader: {
					keepCase: true,
					defaults: true,
				}
			},

		};
	}

	get ordersClientOption(): ClientOptions {
		return {
			transport: Transport.TCP,
			options: {
				host: this.configService.get('ORDERS_CLIENT_HOST') || '0.0.0.0',
				port: this.getOrdersClientPort(),
			},
		};
	}
}
