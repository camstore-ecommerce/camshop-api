import { AbstractMongoRepository } from '@app/common/database';
import { Injectable, Logger } from '@nestjs/common';
import { Product } from './schema/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { RpcException } from '@nestjs/microservices';

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
	): Promise<Product[]> {
		try {
			const documents = this.model
					.find(
						{ ...filterQuery, deleted_at: null },
						options?.projection,
						options,
					)
					.lean<Product[]>(true)
					.populate('category')
					.populate('manufacturer');
			return documents;
		} catch (error) {
			console.error(error);
			throw new RpcException(error.message);
		}
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
			console.error(error);
			throw new RpcException(error.message);
		}
	}

	async findOneAndUpdate(
		filterQuery: FilterQuery<Product>,
		update: UpdateQuery<Product>,
	): Promise<Product> {
		try {
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
				throw new RpcException('Document not found');
			}
			return document;
		} catch (error) {
			console.error(error);
			throw new RpcException(error.message);
		}
	}
}
