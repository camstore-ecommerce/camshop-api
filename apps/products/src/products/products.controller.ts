import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import {
	CreateProductDto,
	FindOneProductDto,
	PermanentlyRemoveProductDto,
	Product,
	Products,
	ProductsServiceController,
	ProductsServiceControllerMethods,
	RemoveProductDto,
	UpdateProductDto,
} from '@app/contracts/products';

@Controller()
@ProductsServiceControllerMethods()
export class ProductsController implements ProductsServiceController {
	constructor(private readonly productsService: ProductsService) {}

	async create(createProductDto: CreateProductDto): Promise<Product> {
		return await this.productsService.create(createProductDto);
	}

	async findAll(): Promise<Products> {
		return await this.productsService.findAll();
	}

	findOne(findOneProductDto: FindOneProductDto): Promise<Product> {
		return this.productsService.findOne(findOneProductDto.id);
	}

	update(updateProductDto: UpdateProductDto): Promise<Product> {
		return this.productsService.update(updateProductDto.id, updateProductDto);
	}

	remove(removeProductDto: RemoveProductDto) {
		return this.productsService.remove(removeProductDto.id);
	}

	permanentlyRemove(permanentlyRemoveProductDto: PermanentlyRemoveProductDto) {
		return this.productsService.permanentlyRemove(
			permanentlyRemoveProductDto.id,
		);
	}
}
