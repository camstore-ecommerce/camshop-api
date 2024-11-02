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
	CreateCategoryDto,
	UpdateCategoryDto,
} from '@app/contracts/categories';
import { JwtAuthGuard } from '@app/common/guards';
import { Public, Roles } from '@app/common/decorators';
import { Role } from '@app/common/enums';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Post()
	@Roles(Role.Admin)
	create(@Body() createCategoryDto: CreateCategoryDto) {
		return this.categoriesService.create(createCategoryDto);
	}

	@Get()
	@Public()
	findAll() {
		return this.categoriesService.findAll();
	}

	@Get(':id')
	@Public()
	findOne(@Param('id') id: string) {
		return this.categoriesService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.Admin)
	update(
		@Param('id') id: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		return this.categoriesService.update(id, updateCategoryDto);
	}

	@Delete(':id')
	@Roles(Role.Admin)
	remove(@Param('id') id: string) {
		return this.categoriesService.remove(id);
	}

	@Delete(':id/permanently')
	@Roles(Role.Admin)
	permanentlyRemove(@Param('id') id: string) {
		return this.categoriesService.permanentlyRemove(id);
	}
}
