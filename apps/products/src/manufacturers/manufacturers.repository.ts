import { AbstractMongoRepository } from '@app/common/database';
import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Manufacturer } from './schema/manufacturers.schema';
@Injectable()
export class ManufacturersRepository extends AbstractMongoRepository<Manufacturer> {
	protected readonly logger = new Logger(ManufacturersRepository.name);
	constructor(
		@InjectModel(Manufacturer.name)
		private readonly manufacturerModel: Model<Manufacturer>,
	) {
		super(manufacturerModel);
	}
}
