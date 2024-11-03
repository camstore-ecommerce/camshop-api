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
		return await this.manufacturersRepository.create(
			createManufacturerDto,
		);
	}

	async findAll() {
		const manufacturers = await this.manufacturersRepository.find({});
		return {
			count: manufacturers.count,
			manufacturers: manufacturers.documents
		}
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
