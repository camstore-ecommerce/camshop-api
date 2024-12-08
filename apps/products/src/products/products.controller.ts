import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import {
	CreateProductDto,
	FindByIdsDto,
	FindOneProductDto,
	PermanentlyRemoveProductDto,
	Products,
	ProductsServiceController,
	ProductsServiceControllerMethods,
	RemoveProductDto,
	UpdateProductDto,
} from '@app/contracts/products';

@Controller()
@ProductsServiceControllerMethods()
export class ProductsController implements ProductsServiceController {
	constructor(private readonly productsService: ProductsService) { }

	async create(createProductDto: CreateProductDto) {
		const product = await this.productsService.create(createProductDto);
		return this.productsService.toProduct(product, product.category, product.manufacturer);
	}

	async findAll(): Promise<Products> {
		const products = await this.productsService.findAll();
		return {
			...products,
			products: products.products.map((product) =>
				this.productsService.toProduct(product, product.category, product.manufacturer)
			),
		};
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

	async findOne(findOneProductDto: FindOneProductDto) {
		const product = await this.productsService.findOne(findOneProductDto.id);
		return this.productsService.toProduct(product, product.category, product.manufacturer);
	}

	async update(updateProductDto: UpdateProductDto) {
		const product = await this.productsService.update(
			updateProductDto.id,
			updateProductDto,
		);

		return this.productsService.toProduct(product, product.category, product.manufacturer);
	}

	async remove(removeProductDto: RemoveProductDto) {
		return await this.productsService.remove(removeProductDto.id);
	}

	async permanentlyRemove(
		permanentlyRemoveProductDto: PermanentlyRemoveProductDto,
	) {
		return await this.productsService.permanentlyRemove(
			permanentlyRemoveProductDto.id,
		);
	}
}
