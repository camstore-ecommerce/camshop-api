import { AbstractMongoRepository } from '@app/common/database';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/categories.schema';

@Injectable()
export class CategoriesRepository extends AbstractMongoRepository<Category> {
	protected readonly logger = new Logger(CategoriesRepository.name);
	constructor(
		@InjectModel(Category.name) private readonly categoryModel: Model<Category>,
	) {
		super(categoryModel);
	}
}
