import { Inject, Injectable } from '@nestjs/common';
import { PRODUCTS_CLIENT } from '@app/common/constants/services';

import {
	PRODUCTS_PATTERNS,
	CreateProductDto as ClientCreateProductDto,
	UpdateProductDto as ClientUpdateProductDto,
	ProductDto as ClientProductDto,
} from '@app/contracts/products';

import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
	constructor(
		@Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientProxy,
	) {}

	create(createProductDto: ClientCreateProductDto) {
		return this.productsClient.send<ClientProductDto, ClientCreateProductDto>(
			PRODUCTS_PATTERNS.CREATE,
			createProductDto,
		);
	}

	findAll() {
		return this.productsClient.send(PRODUCTS_PATTERNS.FIND_ALL, {});
	}

	findOne(id: string) {
		return this.productsClient.send(PRODUCTS_PATTERNS.FIND_ONE, id);
	}

	update(id: string, updateProductDto: ClientUpdateProductDto) {
		return this.productsClient.send(PRODUCTS_PATTERNS.UPDATE, {
			id,
			...updateProductDto,
		});
	}

	remove(id: string) {
		return this.productsClient.send(PRODUCTS_PATTERNS.REMOVE, id);
	}

	permanentlyRemove(id: string) {
		return this.productsClient.send(PRODUCTS_PATTERNS.PERMANENTLY_REMOVE, id);
	}
}
