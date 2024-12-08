import { CART_PACKAGE_NAME } from '@app/contracts/cart';
import { ORDERS_PACKAGE_NAME } from '@app/contracts/orders';
import { PRODUCTS_PACKAGE_NAME } from '@app/contracts/products';
import { USERS_PACKAGE_NAME } from '@app/contracts/users';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
	constructor(private configService: ConfigService) { }

	getCdnCloudName(): string {
		return this.configService.get<string>('CDN_CLOUD_NAME');
	}

	getCdnApiKey(): string {
		return this.configService.get<string>('CDN_API_KEY');
	}

	getCdnApiSecret(): string {
		return this.configService.get<string>('CDN_API_SECRET');
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
					'proto/products/inventory.proto',
				],
				url: this.configService.get('PRODUCTS_CLIENT_URL'),
				loader: {
					keepCase: true,
					longs: String,
					enums: String,
					defaults: false,
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
					'proto/users/addresses.proto'
				],
				url: this.configService.get('USERS_CLIENT_URL'),
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

	get ordersClientOption(): ClientOptions {
		return {
			transport: Transport.GRPC,
			options: {
				package: ORDERS_PACKAGE_NAME,
				protoPath: ['proto/orders/orders.proto'],
				url: this.configService.get('ORDERS_CLIENT_URL'),
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

	get cartClientOption(): ClientOptions {
		return {
			transport: Transport.GRPC,
			options: {
				package: CART_PACKAGE_NAME,
				protoPath: ['proto/cart/cart.proto'],
				url: this.configService.get('CART_CLIENT_URL'),
				loader: {
					keepCase: true,
					longs: String,
					enums: String,
					defaults: true,
					oneofs: true,
					objects: true,
				},
			},
		};
	}
}
