import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientConfigService {
	constructor(private configService: ConfigService) {}

	getProductsClientPort(): number {
		return this.configService.get<number>('PRODUCTS_CLIENT_PORT');
	}

	getUsersClientPort(): number {
		return this.configService.get<number>('USERS_CLIENT_PORT');
	}

	get productsClientOption(): ClientOptions {
		return {
			transport: Transport.TCP,
			options: { 
				host: this.configService.get("PRODUCTS_CLIENT_HOST") || '0.0.0.0',
				port: this.getProductsClientPort() },
		};
	}

	get usersClientOption(): ClientOptions {
		return {
			transport: Transport.TCP,
			options: { 
				host: this.configService.get("USERS_CLIENT_HOST") || '0.0.0.0',
				port: this.getUsersClientPort() },
		};
	}
}
