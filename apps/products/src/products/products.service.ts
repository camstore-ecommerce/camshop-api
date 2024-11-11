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

		const product = await this.productsRepository.create({
			...productData,
			description: productData.description || '',
			stock: productData.stock || 0,
			price: productData.price || 0,
			category,
			manufacturer,
			image_url: '',
		});

		return {
			...product,
			category: category,
			manufacturer: manufacturer,
		};
	}

	async findAll() {
		const products = await this.productsRepository.find({});
		return {
			count: products.count,
			products: products.documents,
		};
	}

	async findByIds(ids: string[]) {
		const products = await this.productsRepository.find({ _id: { $in: ids } });
		return {
			count: products.count,
			products: products.documents,
		};
	}

	async findOne(_id: string) {
		return await this.productsRepository.findOne({ _id });
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
