import { PRODUCTS_PATH } from '@app/common/constants/proto-path';
import { PRODUCTS_PACKAGE_NAME } from '@app/contracts/products';
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
				protoPath: PRODUCTS_PATH,
				url: this.configService.get('PRODUCTS_CLIENT_URL'),
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
