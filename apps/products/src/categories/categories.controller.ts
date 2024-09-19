import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoriesService } from './categories.service';
import {
	CATEGORIES_PATTERNS,
	CreateCategoryDto,
	UpdateCategoryDto,
} from '@app/contracts/categories';

@Controller()
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@MessagePattern(CATEGORIES_PATTERNS.CREATE)
	create(@Payload() createCategoryDto: CreateCategoryDto) {
		return this.categoriesService.create(createCategoryDto);
	}

	@MessagePattern(CATEGORIES_PATTERNS.FIND_ALL)
	findAll() {
		return this.categoriesService.findAll();
	}

	@MessagePattern(CATEGORIES_PATTERNS.FIND_ONE)
	findOne(@Payload() id: string) {
		return this.categoriesService.findOne(id);
	}

	@MessagePattern(CATEGORIES_PATTERNS.UPDATE)
	update(@Payload() updateCategoryDto: UpdateCategoryDto) {
		return this.categoriesService.update(
			updateCategoryDto.id,
			updateCategoryDto,
		);
	}

	@MessagePattern(CATEGORIES_PATTERNS.REMOVE)
	remove(@Payload() id: string) {
		return this.categoriesService.remove(id);
	}

	@MessagePattern(CATEGORIES_PATTERNS.PERMANENTLY_REMOVE)
	permanentlyRemove(@Payload() id: string) {
		return this.categoriesService.permanentlyRemove(id);
	}
}
