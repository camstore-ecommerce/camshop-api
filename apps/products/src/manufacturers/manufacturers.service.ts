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
		const manufacturer = await this.manufacturersRepository.create(
			createManufacturerDto,
		);
		return { id: manufacturer._id.toString(), ...manufacturer };
	}

	async findAll() {
		const manufacturers = await this.manufacturersRepository.find({});
		return {
			count: manufacturers.count,
			manufacturers: manufacturers.documents.map((manufacturer) => ({
				id: manufacturer._id.toString(),
				...manufacturer,
			})),
		};
	}

	async findOne(_id: string) {
		const manufacturer = await this.manufacturersRepository.findOne({ _id });
		return { id: manufacturer._id.toString(), ...manufacturer };
	}

	async update(_id: string, updateManufacturerDto: UpdateManufacturerDto) {
		const manufacturer = await this.manufacturersRepository.findOneAndUpdate(
			{ _id },
			{ $set: updateManufacturerDto },
		);
		return { id: manufacturer._id.toString(), ...manufacturer };
	}

	async remove(_id: string) {
		await this.manufacturersRepository.softDelete({ _id });
		return {};
	}

	async permanentlyRemove(_id: string) {
		return await this.manufacturersRepository.findOneAndDelete({ _id });
	}
}
