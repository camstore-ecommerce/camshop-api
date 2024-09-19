import { PRODUCTS_CLIENT } from '@app/common/constants/services';
import {
	CATEGORIES_PATTERNS,
	CreateCategoryDto as ClientCreateCategoryDto,
	UpdateCategoryDto as ClientUpdateCategoryDto,
	CategoryDto as ClientCategoryDto,
} from '@app/contracts/categories';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Injectable()
export class CategoriesService {
	constructor(
		@Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientProxy,
	) {}

	create(createCategoryDto: ClientCreateCategoryDto) {
		return this.productsClient
			.send<
				ClientCategoryDto,
				ClientCreateCategoryDto
			>(CATEGORIES_PATTERNS.CREATE, createCategoryDto)
			.pipe(map((response) => ({ id: response._id, name: response.name })));
	}

	findAll() {
		return this.productsClient.send(CATEGORIES_PATTERNS.FIND_ALL, {});
	}

	findOne(id: string) {
		return this.productsClient.send(CATEGORIES_PATTERNS.FIND_ONE, id);
	}

	update(id: string, updateCategoryDto: ClientUpdateCategoryDto) {
		return this.productsClient.send(CATEGORIES_PATTERNS.UPDATE, {
			id,
			...updateCategoryDto,
		});
	}

	remove(id: string) {
		return this.productsClient.send(CATEGORIES_PATTERNS.REMOVE, id);
	}

	permanentlyRemove(id: string) {
		return this.productsClient.send(CATEGORIES_PATTERNS.PERMANENTLY_REMOVE, id);
	}
}
