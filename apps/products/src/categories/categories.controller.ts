import { Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
	CategoriesServiceController,
	CategoriesServiceControllerMethods,
	CreateCategoryDto,
	PermanentlyRemoveCategoryDto,
	RemoveCategoryDto,
	UpdateCategoryDto,
} from '@app/contracts/categories';
import { Category as CategorySchema } from './schema/categories.schema';

@Controller()
@CategoriesServiceControllerMethods()
export class CategoriesController implements CategoriesServiceController {
	constructor(private readonly categoriesService: CategoriesService) {}

	async create(createCategoryDto: CreateCategoryDto){
		const category: CategorySchema = await this.categoriesService.create(createCategoryDto);
		return this.categoriesService.toCategory(category);
	}

	async findAll() {
		const categories = await this.categoriesService.findAll();
		return {
			count: categories.count,
			categories: categories.categories.map((category: CategorySchema) =>
				this.categoriesService.toCategory(category),
			),
		};
	}

	async findOne(updateCategoryDto: UpdateCategoryDto) {
		const category: CategorySchema = await this.categoriesService.findOne(updateCategoryDto.id);
		return this.categoriesService.toCategory(category);
	}

	async update(updateCategoryDto: UpdateCategoryDto) {
		const category: CategorySchema = await this.categoriesService.update(
			updateCategoryDto.id,
			updateCategoryDto,
		);
		return this.categoriesService.toCategory(category);
	}

	async remove(removeCategoryDto: RemoveCategoryDto) {
		return await this.categoriesService.remove(removeCategoryDto.id);
	}

	async permanentlyRemove(
		permanentlyRemoveCategoryDto: PermanentlyRemoveCategoryDto,
	) {
		return await this.categoriesService.permanentlyRemove(
			permanentlyRemoveCategoryDto.id,
		);
	}
}
