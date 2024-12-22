import {
	CreateManufacturerDto,
	UpdateManufacturerDto,
} from '@app/contracts/manufacturers';
import { Injectable } from '@nestjs/common';
import { ManufacturersRepository } from './manufacturers.repository';
import { Manufacturer as ManufacturerSchema} from './schema/manufacturers.schema';
import { Manufacturer } from '@app/contracts/manufacturers';

@Injectable()
export class ManufacturersService {
	constructor(
		private readonly manufacturersRepository: ManufacturersRepository,
	) {}

	/**
	 * Convert ManufacturerSchema to proto Manufacturer
	 * @param manufacturer 
	 * @returns 
	 */
	toManufacturer(manufacturer: ManufacturerSchema): Manufacturer {
		return {
			id: manufacturer._id.toString(),
			name: manufacturer.name,
		};
	}

	async create(createManufacturerDto: CreateManufacturerDto) {
		return await this.manufacturersRepository.create(createManufacturerDto);
	}

	async findAll() {
		const manufacturers = await this.manufacturersRepository.find({});
		return {
			count: manufacturers.length,
			manufacturers,
		};
	}

	async findOne(_id: string) {
		return await this.manufacturersRepository.findOne({ _id });
	}

	async update(_id: string, updateManufacturerDto: UpdateManufacturerDto) {
		return await this.manufacturersRepository.findOneAndUpdate(
			{ _id },
			{ $set: updateManufacturerDto },
		);
	}

	async remove(_id: string) {
		await this.manufacturersRepository.softDelete({ _id });
		return {};
	}

	async permanentlyRemove(_id: string) {
		return await this.manufacturersRepository.findOneAndDelete({ _id });
	}
}
