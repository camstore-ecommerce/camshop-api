import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractMongoRepository<
	TDocument extends AbstractDocument,
> {
	protected abstract readonly logger: Logger;
	constructor(protected readonly model: Model<TDocument>) { }

	async create(
		document: Omit<TDocument, '_id' | 'deleted_at'>,
	): Promise<TDocument> {
		try {
			const createdDocument = new this.model({
				_id: new Types.ObjectId(),
				...document,
				deleted_at: null,
			});

			return (await createdDocument.save()).toJSON() as unknown as TDocument;
		} catch (error) {
			this.logger.error(error);
			throw new RpcException('Failed to create document');
		}
	}

	async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
		try {
			const document = await this.model
				.findOne(filterQuery)
				.lean<TDocument>(true);
			return document.deleted_at ? null : document;
		} catch (error) {
			throw new RpcException(error.message);
		}
	}

	async findOneAndUpdate(
		filterQuery: FilterQuery<TDocument>,
		update: UpdateQuery<TDocument>,
	): Promise<TDocument> {
		try {
			const document = await this.model
				.findOneAndUpdate({ ...filterQuery, deleted_at: null }, update, {
					new: true,
				})
				.lean<TDocument>(true);
			if (!document) {
				this.logger.warn(
					`Document not found with filter: ${JSON.stringify(filterQuery)}`,
				);
				throw new RpcException('Document not found');
			}
			return document;

		} catch (error) {
			throw new RpcException(error.message);
		}
	}

	async find(
		filterQuery: FilterQuery<TDocument>,
		options?: QueryOptions<TDocument>,
	): Promise<{ count: number; documents: TDocument[] }> {
		try {
			const [count, documents] = await Promise.all([
				this.model.countDocuments({ ...filterQuery, deleted_at: undefined }),
				this.model
					.find(
						{ ...filterQuery, deleted_at: null },
						options?.projection,
						options,
					)
					.lean<TDocument[]>(true),
			]); // Implement this
			return { count, documents };
		} catch (error) {
			throw new RpcException(error.message);
		}
	}

	async softDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
		try {			
			const document = await this.model
				.findOne(filterQuery)
				.lean<TDocument>(true);
			if (!document) {
				this.logger.warn(
					`Document not found with filter: ${JSON.stringify(filterQuery)}`,
				);
				throw new RpcException('Document not found');
			}
			return this.findOneAndUpdate(filterQuery, { deleted_at: new Date() });
		} catch (error) {
			throw new RpcException(error.message);
		}
	}

	async findOneAndDelete(
		filterQuery: FilterQuery<TDocument>,
	): Promise<TDocument> {
		return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
	}
}
