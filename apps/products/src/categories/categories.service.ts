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
		const category = await this.categoriesRepository.create(createCategoryDto);
		return { id: category._id.toString(), ...category };
	}

	async findAll() {
		const categories = await this.categoriesRepository.find({});
		return {
			count: categories.count,
			categories: categories.documents.map((category) => ({
				id: category._id.toString(),
				...category,
			})),
		};
	}

	async findOne(_id: string) {
		const category = await this.categoriesRepository.findOne({ _id });
		return { id: category._id.toString(), ...category };
	}

	async update(_id: string, updateCategoryDto: UpdateCategoryDto) {
		const category = await this.categoriesRepository.findOneAndUpdate(
			{ _id },
			{ $set: updateCategoryDto },
		);

		return { id: category._id.toString(), ...category };
	}

	async remove(_id: string) {
		await this.categoriesRepository.softDelete({ _id });
		return {};
	}

	async permanentlyRemove(_id: string) {
		return await this.categoriesRepository.findOneAndDelete({ _id });
	}
}
