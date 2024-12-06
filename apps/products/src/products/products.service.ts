import { Injectable } from '@nestjs/common';
import { CreateProductDto, Product, UpdateProductDto } from '@app/contracts/products';
import { ProductsRepository } from './products.repository';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { CategoriesService } from '../categories/categories.service';
import { Product as ProductSchema } from './schema/products.schema';
import { Category as CategorySchema } from '../categories/schema/categories.schema';
import { Manufacturer as ManufacturerSchema } from '../manufacturers/schema/manufacturers.schema';
import { convertNaNToNull } from '@app/common/utils';

@Injectable()
export class ProductsService {
	constructor(
		private readonly productsRepository: ProductsRepository,
		private readonly manufacturersService: ManufacturersService,
		private readonly categoriesService: CategoriesService,
	) {}

	private toProduct(product: ProductSchema, category: CategorySchema, manufacturer: ManufacturerSchema): Product {
		return {
			id: product._id.toString(),
			...product,
			category: this.categoriesService.toCategory(category),
			manufacturer: this.manufacturersService.toManufacturer(manufacturer),
		};
	}

	async create(createProductDto: CreateProductDto) {
		const { manufacturer_id, category_id, ...productData } = createProductDto;

		const category = await this.categoriesService.findOne(category_id);
		const manufacturer =
			await this.manufacturersService.findOne(manufacturer_id);

		const product = await this.productsRepository.create({
			...productData,
			category,
			manufacturer,
		});

		return this.toProduct(product, category, manufacturer);
	}

	async findAll() {
		const products = await this.productsRepository.find({});
		return {
			count: products.length,
			products: products.map((product) => {
				return this.toProduct(product, product.category, product.manufacturer);
			}),
		};
	}

	async findByIds(ids: string[]) {
		const products = await this.productsRepository.find({ _id: { $in: ids } });
		return {
			count: products.length,
			products: products.map((product) => {
				return this.toProduct(product, product.category, product.manufacturer);
			}),
		};
	}

	async findOne(_id: string) {
		const product = await this.productsRepository.findOne({ _id });
		return this.toProduct(product, product.category, product.manufacturer);
	}

	async update(_id: string, updateProductDto: UpdateProductDto) {
		updateProductDto = convertNaNToNull(updateProductDto);
		const existProduct = await this.productsRepository.findOne({ _id });
		
		if (updateProductDto.category_id) {
			existProduct.category = await this.categoriesService.findOne(
				updateProductDto.category_id,
			);
		}

		if (updateProductDto.manufacturer_id) {
			existProduct.manufacturer = await this.manufacturersService.findOne(
				updateProductDto.manufacturer_id,
			);
		}

		console.log(updateProductDto);

		const product = await this.productsRepository.findOneAndUpdate({ _id }, { ...existProduct,...updateProductDto });
		return this.toProduct(product, product.category, product.manufacturer);
	}

	remove(_id: string) {
		return this.productsRepository.softDelete({ _id });
	}

	permanentlyRemove(_id: string) {
		return this.productsRepository.findOneAndDelete({ _id });
	}
}
