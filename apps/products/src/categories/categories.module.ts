import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesRepository } from './categories.repository';
import { Category, CategorySchema } from './schema/categories.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Category.name, schema: CategorySchema },
		]),
	],
	controllers: [CategoriesController],
	providers: [CategoriesService, CategoriesRepository],
	exports: [CategoriesService],
})
export class CategoriesModule {}
