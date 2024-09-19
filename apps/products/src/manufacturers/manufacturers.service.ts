import {
	CreateManufacturerDto,
	UpdateManufacturerDto,
} from '@app/contracts/manufacturers';
import { Injectable } from '@nestjs/common';
import { ManufacturersRepository } from './manufacturers.repository';

@Injectable()
export class ManufacturersService {
	constructor(
		private readonly manufacturersRepository: ManufacturersRepository,
	) {}

	async create(createManufacturerDto: CreateManufacturerDto) {
		return this.manufacturersRepository.create(createManufacturerDto);
	}

	findAll() {
		return this.manufacturersRepository.find({});
	}

	findOne(_id: string) {
		return this.manufacturersRepository.findOne({ _id });
	}

	update(_id: string, updateManufacturerDto: UpdateManufacturerDto) {
		return this.manufacturersRepository.findOneAndUpdate(
			{ _id },
			{ $set: updateManufacturerDto },
		);
	}

	remove(_id: string) {
		return this.manufacturersRepository.softDelete({ _id });
	}

	permanentlyRemove(_id: string) {
		return this.manufacturersRepository.findOneAndDelete({ _id });
	}
}
