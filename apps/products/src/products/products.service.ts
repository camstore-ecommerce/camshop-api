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
			id: product._id.toString(),
			...product,
			category: { id: product.category._id.toString(), ...product.category },
			manufacturer: {
				id: product.manufacturer._id.toString(),
				...product.manufacturer,
			},
		};
	}

	async findAll() {
		const products = await this.productsRepository.find({});
		return {
			count: products.count,
			products: products.documents.map((product) => ({
				id: product._id.toString(),
				...product,
				category: { id: product.category._id.toString(), ...product.category },
				manufacturer: {
					id: product.manufacturer._id.toString(),
					...product.manufacturer,
				},
			})),
		};
	}

	async findOne(_id: string) {
		const product = await this.productsRepository.findOne({ _id });
		return {
			id: product._id.toString(),
			...product,
			category: { id: product.category._id.toString(), ...product.category },
			manufacturer: {
				id: product.manufacturer._id.toString(),
				...product.manufacturer,
			},
		};
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

		const product = await this.productsRepository.findOneAndUpdate(
			{ _id },
			updates,
		);

		return {
			id: product._id.toString(),
			...product,
			category: { id: product.category._id.toString(), ...product.category },
			manufacturer: {
				id: product.manufacturer._id.toString(),
				...product.manufacturer,
			},
		};
	}

	remove(_id: string) {
		return this.productsRepository.softDelete({ _id });
	}

	permanentlyRemove(_id: string) {
		return this.productsRepository.findOneAndDelete({ _id });
	}
}
