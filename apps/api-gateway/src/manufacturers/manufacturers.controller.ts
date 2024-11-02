import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import {
	CreateManufacturerDto,
	UpdateManufacturerDto,
} from '@app/contracts/manufacturers';
import { JwtAuthGuard } from '@app/common/guards';
import { Public, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';

@Controller('manufacturers')
@UseGuards(JwtAuthGuard)
export class ManufacturersController {
	constructor(private readonly manufacturersService: ManufacturersService) {}

	@Post()
	@Roles(Role.Admin)
	create(@Body() createManufacturerDto: CreateManufacturerDto) {
		return this.manufacturersService.create(createManufacturerDto);
	}

	@Get()
	@Public()
	findAll() {
		return this.manufacturersService.findAll();
	}

	@Get(':id')
	@Public()
	findOne(@Param('id') id: string) {
		return this.manufacturersService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.Admin)
	update(
		@Param('id') id: string,
		@Body() updateManufacturerDto: UpdateManufacturerDto,
	) {
		return this.manufacturersService.update(id, updateManufacturerDto);
	}

	@Delete(':id')
	@Roles(Role.Admin)
	remove(@Param('id') id: string) {
		return this.manufacturersService.remove(id);
	}

	@Delete(':id/permanently')
	@Roles(Role.Admin)
	permanentlyRemove(@Param('id') id: string) {
		return this.manufacturersService.permanentlyRemove(id);
	}
}
