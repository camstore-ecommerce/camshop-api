import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/products.schema';
import { ProductsRepository } from './products.repository';
import { ManufacturersModule } from '../manufacturers/manufacturers.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
		ManufacturersModule,
		CategoriesModule,
	],
	controllers: [ProductsController],
	providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
