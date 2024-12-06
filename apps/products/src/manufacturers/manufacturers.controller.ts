import { Controller } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import {
	CreateManufacturerDto,
	FindOneManufacturerDto,
	ManufacturersServiceController,
	ManufacturersServiceControllerMethods,
	PermanentlyRemoveManufacturerDto,
	RemoveManufacturerDto,
	UpdateManufacturerDto,
} from '@app/contracts/manufacturers';
import { Empty } from '@app/common/interfaces';
import { Manufacturer as ManufacturerSchema } from './schema/manufacturers.schema';

@Controller()
@ManufacturersServiceControllerMethods()
export class ManufacturersController implements ManufacturersServiceController {
	constructor(private readonly manufacturersService: ManufacturersService) { }

	async create(
		createManufacturerDto: CreateManufacturerDto,
	) {
		const manufacturer: ManufacturerSchema = await this.manufacturersService.create(createManufacturerDto);
		return this.manufacturersService.toManufacturer(manufacturer);
	}

	async findAll() {
		const manufacturers = await this.manufacturersService.findAll();
		return {
			...manufacturers,
			manufacturers: manufacturers.manufacturers.map((manufacturer: ManufacturerSchema) =>
				this.manufacturersService.toManufacturer(manufacturer)
			),
		}
	}

	async findOne(
		findOneManufacturerDto: FindOneManufacturerDto,
	) {
		const manufacturer: ManufacturerSchema = await this.manufacturersService.findOne(findOneManufacturerDto.id);
		return this.manufacturersService.toManufacturer(manufacturer);
	}

	async update(
		updateManufacturerDto: UpdateManufacturerDto,
	) {
		const manufacturer: ManufacturerSchema = await this.manufacturersService.update(
			updateManufacturerDto.id,
			updateManufacturerDto,
		);
		return this.manufacturersService.toManufacturer(manufacturer);
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
