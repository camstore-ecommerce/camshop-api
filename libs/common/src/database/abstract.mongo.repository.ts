import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractMongoRepository<
	TDocument extends AbstractDocument,
> {
	protected abstract readonly logger: Logger;
	constructor(protected readonly model: Model<TDocument>) {}

	async create(
		document: Omit<TDocument, '_id' | 'deleted_at'>,
	): Promise<TDocument> {
		const createdDocument = new this.model({
			_id: new Types.ObjectId(),
			...document,
			deleted_at: null,
		});

		return (await createdDocument.save()).toJSON() as unknown as TDocument;
	}

	async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
		const document = await this.model
			.findOne(filterQuery)
			.lean<TDocument>(true);
		if (!document) {
			this.logger.warn(
				`Document not found with filter: ${JSON.stringify(filterQuery)}`,
			);
			throw new NotFoundException('Document not found');
		}
		return document.deleted_at ? null : document;
	}

	async findOneAndUpdate(
		filterQuery: FilterQuery<TDocument>,
		update: UpdateQuery<TDocument>,
	): Promise<TDocument> {
		const document = await this.model
			.findOneAndUpdate({ ...filterQuery, deleted_at: null }, update, {
				new: true,
			})
			.lean<TDocument>(true);
		if (!document) {
			this.logger.warn(
				`Document not found with filter: ${JSON.stringify(filterQuery)}`,
			);
			throw new NotFoundException('Document not found');
		}
		return document;
	}

	async find(
		filterQuery: FilterQuery<TDocument>,
		options?: QueryOptions<TDocument>,
	): Promise<{ count: number; documents: TDocument[] }> {
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
	}

	async softDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
		const document = await this.model
			.findOne(filterQuery)
			.lean<TDocument>(true);
		if (!document) {
			this.logger.warn(
				`Document not found with filter: ${JSON.stringify(filterQuery)}`,
			);
			throw new NotFoundException('Document not found');
		}
		return this.findOneAndUpdate(filterQuery, { deleted_at: new Date() });
	}

	async findOneAndDelete(
		filterQuery: FilterQuery<TDocument>,
	): Promise<TDocument> {
		return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
	}
}
