import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PRODUCTS_CLIENT, USERS_CLIENT } from '@app/common/constants/services';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigService } from '../client-config/client-config.service';
import { ClientConfigModule } from '../client-config/client-config.module';

@Module({
	imports: [ClientConfigModule],
	controllers: [CategoriesController],
	providers: [
		CategoriesService,
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
	],
})
export class CategoriesModule {}
