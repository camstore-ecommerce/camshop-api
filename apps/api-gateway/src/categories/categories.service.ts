import { PRODUCTS_CLIENT } from '@app/common/constants/services';
import {
	CATEGORIES_SERVICE_NAME,
	CategoriesServiceClient,
	CreateCategoryDto,
	UpdateCategoryDto,
} from '@app/contracts/categories';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class CategoriesService implements OnModuleInit {
	private categtoriesServiceClient: CategoriesServiceClient;
	constructor(
		@Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientGrpc,
	) {}

	onModuleInit() {
		this.categtoriesServiceClient =
			this.productsClient.getService<CategoriesServiceClient>(
				CATEGORIES_SERVICE_NAME,
			);
	}

	create(createCategoryDto: CreateCategoryDto) {
		return this.categtoriesServiceClient.create(createCategoryDto)
	}

	findAll() {
		return this.categtoriesServiceClient.findAll({});
	}

	findOne(id: string) {
		return this.categtoriesServiceClient.findOne({ id });
	}

	update(id: string, updateCategoryDto: UpdateCategoryDto) {
		return this.categtoriesServiceClient.update({ id, ...updateCategoryDto });
	}

	remove(id: string) {
		return this.categtoriesServiceClient.remove({ id });
	}

	permanentlyRemove(id: string) {
		return this.categtoriesServiceClient.permanentlyRemove({ id });
	}
}
