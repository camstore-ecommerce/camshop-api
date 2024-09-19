import { AbstractMongoRepository } from '@app/common/database';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Product } from './schema/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

@Injectable()
export class ProductsRepository extends AbstractMongoRepository<Product> {
	protected readonly logger = new Logger(ProductsRepository.name);
	constructor(
		@InjectModel(Product.name) private readonly productModel: Model<Product>,
	) {
		super(productModel);
	}

	async find(
		filterQuery: FilterQuery<Product>,
		options?: QueryOptions<Product>,
	): Promise<{ count: number; documents: Product[] }> {
		const [count, documents] = await Promise.all([
			this.model.countDocuments({ ...filterQuery, deleted_at: undefined }),
			this.model
				.find(
					{ ...filterQuery, deleted_at: null },
					options?.projection,
					options,
				)
				.lean<Product[]>(true)
				.populate('category')
				.populate('manufacturer'),
		]); // Implement this
		return { count, documents };
	}

	async findOne(filterQuery: FilterQuery<Product>): Promise<Product> {
		try {
			const document = await this.model
				.findOne(filterQuery)
				.lean<Product>(true)
				.populate('category')
				.populate('manufacturer');
			if (!document) {
				this.logger.warn(
					`Document not found with filter: ${JSON.stringify(filterQuery)}`,
				);
			}
			return document.deleted_at ? null : document;
		} catch (error) {
			throw new NotFoundException('Document not found');
		}
	}

	async findOneAndUpdate(
		filterQuery: FilterQuery<Product>,
		update: UpdateQuery<Product>,
	): Promise<Product> {
		const document = await this.model
			.findOneAndUpdate({ ...filterQuery, deleted_at: null }, update, {
				new: true,
			})
			.lean<Product>(true)
			.populate('category')
			.populate('manufacturer');
		if (!document) {
			this.logger.warn(
				`Document not found with filter: ${JSON.stringify(filterQuery)}`,
			);
			throw new NotFoundException('Document not found');
		}
		return document;
	}
}
