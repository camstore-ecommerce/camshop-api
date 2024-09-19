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
		return this.categoriesRepository.create(createCategoryDto);
	}

	findAll() {
		return this.categoriesRepository.find({});
	}

	findOne(_id: string) {
		return this.categoriesRepository.findOne({ _id });
	}

	update(_id: string, updateCategoryDto: UpdateCategoryDto) {
		return this.categoriesRepository.findOneAndUpdate(
			{ _id },
			{ $set: updateCategoryDto },
		);
	}

	remove(_id: string) {
		return this.categoriesRepository.softDelete({ _id });
	}

	permanentlyRemove(_id: string) {
		return this.categoriesRepository.findOneAndDelete({ _id });
	}
}
