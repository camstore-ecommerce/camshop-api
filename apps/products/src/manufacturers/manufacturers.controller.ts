import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ManufacturersService } from './manufacturers.service';
import {
	CreateManufacturerDto,
	MANUFACTURERS_PATTERNS,
	UpdateManufacturerDto,
} from '@app/contracts/manufacturers';

@Controller()
export class ManufacturersController {
	constructor(private readonly manufacturersService: ManufacturersService) {}

	@MessagePattern(MANUFACTURERS_PATTERNS.CREATE)
	create(@Payload() createManufacturerDto: CreateManufacturerDto) {
		return this.manufacturersService.create(createManufacturerDto);
	}

	@MessagePattern(MANUFACTURERS_PATTERNS.FIND_ALL)
	findAll() {
		return this.manufacturersService.findAll();
	}

	@MessagePattern(MANUFACTURERS_PATTERNS.FIND_ONE)
	findOne(@Payload() id: string) {
		return this.manufacturersService.findOne(id);
	}

	@MessagePattern(MANUFACTURERS_PATTERNS.UPDATE)
	update(@Payload() updateManufacturerDto: UpdateManufacturerDto) {
		return this.manufacturersService.update(
			updateManufacturerDto.id,
			updateManufacturerDto,
		);
	}

	@MessagePattern(MANUFACTURERS_PATTERNS.REMOVE)
	remove(@Payload() id: string) {
		return this.manufacturersService.remove(id);
	}

	@MessagePattern(MANUFACTURERS_PATTERNS.PERMANENTLY_REMOVE)
	permanentlyRemove(@Payload() id: string) {
		return this.manufacturersService.permanentlyRemove(id);
	}
}
