import { AbstractMongoRepository } from "@app/common/database";
import { Injectable, Logger } from "@nestjs/common";
import { Inventory } from "./schema/inventory.schema";
import { FilterQuery, Model, QueryOptions, Types, UpdateQuery } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class InventoryRepository extends AbstractMongoRepository<Inventory> {
    protected readonly logger = new Logger(InventoryRepository.name);
    constructor(
        @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
    ) {
        super(inventoryModel);
    }

    async find(
		filterQuery: FilterQuery<Inventory>,
		options?: QueryOptions<Inventory>,
	): Promise<Inventory[]> {
		try {
			const documents = this.model
					.find(
						{ ...filterQuery, deleted_at: null },
						options?.projection,
						options,
					)
					.lean<Inventory[]>(true)
					.populate('product')
			return documents;
		} catch (error) {
			console.error(error);
			throw new RpcException(error.message);
		}
	}

	async findOne(filterQuery: FilterQuery<Inventory>): Promise<Inventory> {
		try {
			const document = await this.model
				.findOne(filterQuery)
				.lean<Inventory>(true)
				.populate('product');
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
		filterQuery: FilterQuery<Inventory>,
		update: UpdateQuery<Inventory>,
	): Promise<Inventory> {
		try {
			const document = await this.model
				.findOneAndUpdate({ ...filterQuery, deleted_at: null }, update, {
					new: true,
				})
				.lean<Inventory>(true)
				.populate('product');
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