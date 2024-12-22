import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import {
	Category,
	CreateCategoryDto,
	UpdateCategoryDto,
} from '@app/contracts/categories';
import { Category as CategorySchema } from './schema/categories.schema';

@Injectable()
export class CategoriesService {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	/**
	 * Convert CategorySchema to proto Category
	 * @param category 
	 * @returns 
	 */
	toCategory(category: CategorySchema): Category {
		return {
			id: category._id.toString(),
			name: category.name,
		};
	}

	async create(createCategoryDto: CreateCategoryDto) {
		return await this.categoriesRepository.create(createCategoryDto);
	}

	async findAll() {
		const categories = await this.categoriesRepository.find({});
		return {
			count: categories.length,
			categories,
		};
	}

	async findOne(_id: string) {
		return await this.categoriesRepository.findOne({ _id });
	}

	async update(_id: string, updateCategoryDto: UpdateCategoryDto) {
		return await this.categoriesRepository.findOneAndUpdate(
			{ _id },
			{ $set: updateCategoryDto },
		);
	}

	async remove(_id: string) {
		await this.categoriesRepository.softDelete({ _id });
		return {};
	}

	async permanentlyRemove(_id: string) {
		return await this.categoriesRepository.findOneAndDelete({ _id });
	}
}
