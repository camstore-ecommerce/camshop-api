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
	Manufacturer,
	Manufacturers,
	UpdateManufacturerDto,
} from '@app/contracts/manufacturers';
import { JwtAuthGuard } from '@app/common/guards';
import { Public, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('manufacturers')
@UseGuards(JwtAuthGuard)
export class ManufacturersController {
	constructor(private readonly manufacturersService: ManufacturersService) {}

	@Post()
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Create a new manufacturer', description: 'Admin access' })
	@ApiResponse({ status: 201, type: Manufacturer })
	create(@Body() createManufacturerDto: CreateManufacturerDto) {
		return this.manufacturersService.create(createManufacturerDto);
	}

	@Get()
	@Public()
	@ApiOperation({ summary: 'Get all manufacturers', description: 'Public access' })
	@ApiResponse({ status: 201, type: Manufacturers })
	findAll() {
		return this.manufacturersService.findAll();
	}

	@Get(':id')
	@Public()
	@ApiOperation({ summary: 'Get a manufacturer by id', description: 'Public access' })
	@ApiResponse({ status: 201, type: Manufacturer })
	findOne(@Param('id') id: string) {
		return this.manufacturersService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Update a manufacturer by id', description: 'Admin access' })
	@ApiResponse({ status: 201, type: Manufacturer })
	update(
		@Param('id') id: string,
		@Body() updateManufacturerDto: UpdateManufacturerDto,
	) {
		return this.manufacturersService.update(id, updateManufacturerDto);
	}

	@Delete(':id')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Remove a manufacturer by id', description: 'Admin access' })
	remove(@Param('id') id: string) {
		return this.manufacturersService.remove(id);
	}

	@Delete(':id/permanently')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Permanently remove a manufacturer by id', description: 'Admin access' })
	permanentlyRemove(@Param('id') id: string) {
		return this.manufacturersService.permanentlyRemove(id);
	}
}
