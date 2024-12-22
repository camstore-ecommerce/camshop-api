import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from '../prisma.service';
import { PRODUCTS_CLIENT } from '@app/common/constants/services';
import { ClientConfigService } from '../client-config/client-config.service';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientConfigModule } from '../client-config/client-config.module';


@Module({
  imports: [ClientConfigModule],
  controllers: [CartController],
  providers: [CartService, PrismaService, 
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
export class CartModule {}
