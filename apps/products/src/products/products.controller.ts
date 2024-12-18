import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
	CreateProductDto,
	FilterProductDto,
	FindByIdsDto,
	ProductId,
	Products,
	ProductsServiceController,
	ProductsServiceControllerMethods,
	UpdateProductDto,
} from '@app/contracts/products';
import { Pagination } from '@app/common/interfaces';

@Controller()
@ProductsServiceControllerMethods()
export class ProductsController implements ProductsServiceController {
	constructor(private readonly productsService: ProductsService) { }

	async create(createProductDto: CreateProductDto) {
		const product = await this.productsService.create(createProductDto);
		return this.productsService.toProduct(product, product.category, product.manufacturer);
	}

	async findAll(pagination: Pagination): Promise<Products> {
		const products = await this.productsService.findAll(pagination);
		return {
			...products,
			products: products.products.map((product) =>
				this.productsService.toProduct(product, product.category, product.manufacturer)
			),
		};
	}

	async filter(filterProductDto: FilterProductDto) {
		const products = await this.productsService.filter(filterProductDto);

		return {
			...products,
			products: products.products.map((product) =>
				this.productsService.toProduct(product, product.category, product.manufacturer)
			),
		}
	}

	async findByIds(findByIdsDto: FindByIdsDto) {
		const products = await this.productsService.findByIds(findByIdsDto.ids);
		return {
			...products,
			products: products.products.map((product) =>
				this.productsService.toProduct(product, product.category, product.manufacturer)
			),
		};
	}

	async findOne(productId: ProductId) {
		const product = await this.productsService.findOne(productId.id);
		return this.productsService.toProduct(product, product.category, product.manufacturer);
	}

	async update(updateProductDto: UpdateProductDto) {
		const product = await this.productsService.update(
			updateProductDto.id,
			updateProductDto,
		);

		return this.productsService.toProduct(product, product.category, product.manufacturer);
	}

	async remove(productId: ProductId) {
		return await this.productsService.remove(productId.id);
	}

	async permanentlyRemove(
		productId: ProductId,
	) {
		return await this.productsService.permanentlyRemove(
			productId.id,
		);
	}
}
