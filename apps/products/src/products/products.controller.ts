import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import {
	CreateProductDto,
	FindByIdsDto,
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

	async create(createProductDto: CreateProductDto) {
		return await this.productsService.create(createProductDto);
	}

	async findAll(): Promise<Products> {
		return await this.productsService.findAll();
	}

	async findByIds(findByIdsDto: FindByIdsDto) {
		return await this.productsService.findByIds(findByIdsDto.ids);
	}

	async findOne(findOneProductDto: FindOneProductDto) {
		return await this.productsService.findOne(findOneProductDto.id);
	}

	async update(updateProductDto: UpdateProductDto) {
		return await this.productsService.update(
			updateProductDto.id,
			updateProductDto,
		);
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
