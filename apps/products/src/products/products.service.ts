import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@app/contracts/products';
import { ProductsRepository } from './products.repository';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { CategoriesService } from '../categories/categories.service';
import { Product } from './schema/products.schema';

@Injectable()
export class ProductsService {
	constructor(
		private readonly productsRepository: ProductsRepository,
		private readonly manufacturersService: ManufacturersService,
		private readonly categoriesService: CategoriesService,
	) {}

	async create(createProductDto: CreateProductDto) {
		const { manufacturer_id, category_id, ...productData } = createProductDto;

		const category = await this.categoriesService.findOne(category_id);
		const manufacturer =
			await this.manufacturersService.findOne(manufacturer_id);

		return this.productsRepository.create({
			...productData,
			category,
			manufacturer,
			image_url: '',
		});
	}

	findAll() {
		return this.productsRepository.find({});
	}

	findOne(_id: string) {
		return this.productsRepository.findOne({ _id });
	}

	async update(_id: string, updateProductDto: UpdateProductDto) {
		const updates: Partial<Product> = { ...updateProductDto };

		if (updateProductDto.category_id) {
			updates.category = await this.categoriesService.findOne(
				updateProductDto.category_id,
			);
		}

		if (updateProductDto.manufacturer_id) {
			updates.manufacturer = await this.manufacturersService.findOne(
				updateProductDto.manufacturer_id,
			);
		}

		return await this.productsRepository.findOneAndUpdate({ _id }, updates);
	}

	remove(_id: string) {
		return this.productsRepository.softDelete({ _id });
	}

	permanentlyRemove(_id: string) {
		return this.productsRepository.findOneAndDelete({ _id });
	}
}
