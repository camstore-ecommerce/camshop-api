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
import { CategoriesService } from './categories.service';
import {
	Categories,
	Category,
	CreateCategoryDto,
	UpdateCategoryDto,
} from '@app/contracts/categories';
import { JwtAuthGuard } from '@app/common/guards';
import { Public, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Post()
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Create a new category', description: 'Only for admin' })
	@ApiResponse({ status: 201, type: Category })
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoriesService.create(createCategoryDto);
	}

	@Get()
	@Public()
	@ApiOperation({ summary: 'Get all categories', description: 'Public access' })
	@ApiResponse({ status: 201, type: Categories })
	findAll() {
		return this.categoriesService.findAll();
	}

	@Get(':id')
	@Public()
	@ApiOperation({ summary: 'Get a category by id', description: 'Public access' })
	@ApiResponse({ status: 201, type: Category })
	findOne(@Param('id') id: string) {
		return this.categoriesService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Update a category by id', description: 'Only for admin' })
	@ApiResponse({ status: 201, type: Category })
	update(
		@Param('id') id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		return this.categoriesService.update(id, updateCategoryDto);
	}

	@Delete(':id')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Remove a category by id', description: 'Only for admin' })
	remove(@Param('id') id: string) {
		return this.categoriesService.remove(id);
	}

	@Delete(':id/permanently')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Permanently remove a category by id', description: 'Only for admin' })
	permanentlyRemove(@Param('id') id: string) {
		return this.categoriesService.permanentlyRemove(id);
	}
}
