import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import {
	CreateManufacturerDto,
	UpdateManufacturerDto,
} from '@app/contracts/manufacturers';

@Controller('manufacturers')
export class ManufacturersController {
	constructor(private readonly manufacturersService: ManufacturersService) {}

	@Post()
	create(@Body() createManufacturerDto: CreateManufacturerDto) {
		return this.manufacturersService.create(createManufacturerDto);
	}

	@Get()
	findAll() {
		return this.manufacturersService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.manufacturersService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateManufacturerDto: UpdateManufacturerDto,
	) {
		return this.manufacturersService.update(id, updateManufacturerDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.manufacturersService.remove(id);
	}

	@Delete(':id/permanently')
	permanentlyRemove(@Param('id') id: string) {
		return this.manufacturersService.permanentlyRemove(id);
	}
}
