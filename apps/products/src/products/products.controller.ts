import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import {
	CreateProductDto,
	PRODUCTS_PATTERNS,
	UpdateProductDto,
} from '@app/contracts/products';

@Controller()
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@MessagePattern(PRODUCTS_PATTERNS.CREATE)
	create(@Payload() createProductDto: CreateProductDto) {
		return this.productsService.create(createProductDto);
	}

	@MessagePattern(PRODUCTS_PATTERNS.FIND_ALL)
	findAll() {
		return this.productsService.findAll();
	}

	@MessagePattern(PRODUCTS_PATTERNS.FIND_ONE)
	findOne(@Payload() id: string) {
		return this.productsService.findOne(id);
	}

	@MessagePattern(PRODUCTS_PATTERNS.UPDATE)
	update(@Payload() updateProductDto: UpdateProductDto) {
		return this.productsService.update(updateProductDto.id, updateProductDto);
	}

	@MessagePattern(PRODUCTS_PATTERNS.REMOVE)
	remove(@Payload() id: string) {
		return this.productsService.remove(id);
	}

	@MessagePattern(PRODUCTS_PATTERNS.PERMANENTLY_REMOVE)
	permanentlyRemove(@Payload() id: string) {
		return this.productsService.permanentlyRemove(id);
	}
}
