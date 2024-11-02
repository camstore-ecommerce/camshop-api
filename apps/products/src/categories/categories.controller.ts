import { Controller } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
	Categories,
	CategoriesServiceController,
	CategoriesServiceControllerMethods,
	Category,
	CreateCategoryDto,
	PermanentlyRemoveCategoryDto,
	RemoveCategoryDto,
	UpdateCategoryDto,
} from '@app/contracts/categories';

@Controller()
@CategoriesServiceControllerMethods()
export class CategoriesController implements CategoriesServiceController {
	constructor(private readonly categoriesService: CategoriesService) {}

	async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
		return await this.categoriesService.create(createCategoryDto);
	}

	async findAll(): Promise<Categories> {
		return await this.categoriesService.findAll();
	}

	async findOne(updateCategoryDto: UpdateCategoryDto): Promise<Category> {
		return await this.categoriesService.findOne(updateCategoryDto.id);
	}

	async update(updateCategoryDto: UpdateCategoryDto) {
		return await this.categoriesService.update(
			updateCategoryDto.id,
			updateCategoryDto,
		);
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
