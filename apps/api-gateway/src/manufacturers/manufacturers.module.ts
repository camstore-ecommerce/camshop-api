import { Module } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturersController } from './manufacturers.controller';
import { PRODUCTS_CLIENT } from '@app/common/constants/services';
import { ClientConfigService } from '../client-config/client-config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigModule } from '../client-config/client-config.module';

@Module({
	imports: [ClientConfigModule],
	controllers: [ManufacturersController],
	providers: [
		ManufacturersService,
		{
			provide: PRODUCTS_CLIENT,
			useFactory: (configService: ClientConfigService) => {
				const clientOptions = configService.productsClientOption;
				return ClientProxyFactory.create(clientOptions);
			},
			inject: [ClientConfigService],
		},
	],
})
export class ManufacturersModule {}
