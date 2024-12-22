import { Injectable } from '@nestjs/common';
import { CreateProductDto, FilterProductDto, Product, UpdateProductDto } from '@app/contracts/products';
import { ProductsRepository } from './products.repository';
import { ManufacturersService } from '../manufacturers/manufacturers.service';
import { CategoriesService } from '../categories/categories.service';
import { Product as ProductSchema } from './schema/products.schema';
import { Category as CategorySchema } from '../categories/schema/categories.schema';
import { Manufacturer as ManufacturerSchema } from '../manufacturers/schema/manufacturers.schema';
import { Pagination } from '@app/common/interfaces';
import { handlePagination } from '@app/common/utils';

@Injectable()
export class ProductsService {
	constructor(
		private readonly productsRepository: ProductsRepository,
		private readonly manufacturersService: ManufacturersService,
		private readonly categoriesService: CategoriesService,
	) { }


	/**
	 * Convert product schema to product
	 * @param product 
	 * @param category 
	 * @param manufacturer 
	 * @returns 
	 */
	toProduct(product: ProductSchema, category: CategorySchema, manufacturer: ManufacturerSchema): Product {
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
		const manufacturer = await this.manufacturersService.findOne(manufacturer_id);

		return await this.productsRepository.create({
			...productData,
			category,
			manufacturer,
		});
	}

	async findAll(pagination: Pagination) {
		const queryOptions = handlePagination(pagination, '_id');
		const products = (await this.productsRepository.find({},
			{ skip: queryOptions.offset, limit: queryOptions.limit, sort: { [queryOptions.sort]: queryOptions.order } })
		);

		return {
			products,
			pagination: {
				total: products.length,
				...pagination,
			}
		};
	}

	async filter(filterProductDto: FilterProductDto) {
		const { pagination, ...filter } = filterProductDto;
		const queryOptions = handlePagination(pagination, '_id');
		const query = {};

		// Apply filters dynamically based on the DTO fields
		if (filter.name) {
			query['name'] = { $regex: filter.name, $options: 'i' };  // Case-insensitive name filter
		}
		if (filter.category_id) {
			query['category'] = filter.category_id;
		}
		if (filter.manufacturer_id) {
			query['manufacturer'] = filter.manufacturer_id;
		}
		if (filter.tags && filter.tags.length > 0) {
			query['tags'] = { $in: filter.tags };
		}
		if (filter.attributes && filter.attributes.length > 0) {
			filter.attributes.forEach((attribute) => {
				query['attributes'] = { $elemMatch: attribute };  // Example for filtering based on attributes
			});
		}

		const products = (await this.productsRepository.find(query,
			{ skip: queryOptions.offset, limit: queryOptions.limit, sort: { [queryOptions.sort]: queryOptions.order } }
		));

		return {
			products,
			pagination: {
				total: products.length,
				...pagination,
			}
		};
	}

	async findOne(_id: string) {
		return await this.productsRepository.findOne({ _id });
	}

	async update(_id: string, updateProductDto: UpdateProductDto) {
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

		return await this.productsRepository.findOneAndUpdate({ _id }, { ...existProduct, ...updateProductDto });
	}

	remove(_id: string) {
		return this.productsRepository.softDelete({ _id });
	}

	permanentlyRemove(_id: string) {
		return this.productsRepository.findOneAndDelete({ _id });
	}
}
