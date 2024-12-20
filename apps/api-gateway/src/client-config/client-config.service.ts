import { ORDERS_PATH, PRODUCTS_PATH, USERS_PATH } from '@app/common/constants/proto-path';
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
				protoPath: PRODUCTS_PATH,
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
				protoPath: USERS_PATH,
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
				protoPath: ORDERS_PATH,
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
}
