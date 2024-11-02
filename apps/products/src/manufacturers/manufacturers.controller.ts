import { Controller } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import {
	CreateManufacturerDto,
	FindOneManufacturerDto,
	Manufacturer,
	Manufacturers,
	ManufacturersServiceController,
	ManufacturersServiceControllerMethods,
	PermanentlyRemoveManufacturerDto,
	RemoveManufacturerDto,
	UpdateManufacturerDto,
} from '@app/contracts/manufacturers';
import { Empty } from '@app/common/interfaces';

@Controller()
@ManufacturersServiceControllerMethods()
export class ManufacturersController implements ManufacturersServiceController {
	constructor(private readonly manufacturersService: ManufacturersService) {}

	async create(
		createManufacturerDto: CreateManufacturerDto,
	): Promise<Manufacturer> {
		return await this.manufacturersService.create(createManufacturerDto);
	}

	async findAll(): Promise<Manufacturers> {
		return await this.manufacturersService.findAll();
	}

	async findOne(
		findOneManufacturerDto: FindOneManufacturerDto,
	): Promise<Manufacturer> {
		return await this.manufacturersService.findOne(findOneManufacturerDto.id);
	}

	async update(
		updateManufacturerDto: UpdateManufacturerDto,
	): Promise<Manufacturer> {
		return await this.manufacturersService.update(
			updateManufacturerDto.id,
			updateManufacturerDto,
		);
	}

	async remove(removeManufacturerDto: RemoveManufacturerDto): Promise<Empty> {
		return await this.manufacturersService.remove(removeManufacturerDto.id);
	}

	async permanentlyRemove(
		permanentlyRemoveManufacturerDto: PermanentlyRemoveManufacturerDto,
	) {
		return await this.manufacturersService.permanentlyRemove(
			permanentlyRemoveManufacturerDto.id,
		);
	}
}
