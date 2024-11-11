import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import {
	CreateCategoryDto,
	UpdateCategoryDto,
} from '@app/contracts/categories';

@Injectable()
export class CategoriesService {
	constructor(private readonly categoriesRepository: CategoriesRepository) {}

	async create(createCategoryDto: CreateCategoryDto) {
		return await this.categoriesRepository.create(createCategoryDto);
	}

	async findAll() {
		const categories = await this.categoriesRepository.find({});
		return {
			count: categories.count,
			categories: categories.documents,
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
