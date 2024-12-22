import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ClientProxyFactory } from '@nestjs/microservices';
import { PRODUCTS_CLIENT, USERS_CLIENT } from '@app/common/constants/services';
import { ClientConfigModule } from '../client-config/client-config.module';
import { ClientConfigService } from '../client-config/client-config.service';
import { CdnService } from '../cdn/cdn.service';

@Module({
	imports: [ClientConfigModule],
	controllers: [ProductsController],
	providers: [
		ProductsService,
		{
			provide: PRODUCTS_CLIENT,
			useFactory: (configService: ClientConfigService) => {
				const clientOptions = configService.productsClientOption;
				return ClientProxyFactory.create(clientOptions);
			},
			inject: [ClientConfigService],
		},
		{
			provide: USERS_CLIENT,
			useFactory: (configService: ClientConfigService) => {
				const clientOptions = configService.usersClientOption;
				return ClientProxyFactory.create(clientOptions);
			},
			inject: [ClientConfigService],
		},
		CdnService,
	],
})
export class ProductsModule {}
