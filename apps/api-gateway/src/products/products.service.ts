import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PRODUCTS_CLIENT } from '@app/common/constants/services';

import {
	ProductDto as ClientProductDto,
	ProductsServiceClient,
	PRODUCTS_SERVICE_NAME,
	CreateProductDto,
	UpdateProductDto,
	Product,
} from '@app/contracts/products';

import { ClientGrpc } from '@nestjs/microservices';
import { CdnService } from '../cdn/cdn.service';
import { lastValueFrom, map, switchMap } from 'rxjs';

@Injectable()
export class ProductsService implements OnModuleInit {
	private productsServiceClient: ProductsServiceClient;

	constructor(
		@Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientGrpc,
		private readonly cdnService: CdnService,
	) {}

	onModuleInit() {
		this.productsServiceClient =
			this.productsClient.getService<ProductsServiceClient>(
				PRODUCTS_SERVICE_NAME,
			);
	}

	create(createProductDto: CreateProductDto, image?: Express.Multer.File) {
		return this.productsServiceClient.create(createProductDto).pipe(
			switchMap(async (product: Product) => {
				if (image) {
					const { secure_url } = await this.cdnService.uploadImage(
						image,
						product.id,
						'products',
					);
					return await lastValueFrom(
						this.productsServiceClient.update({
							...product, // Spread the existing product properties
							category_id: product.category.id,
							manufacturer_id: product.manufacturer.id,
							image_url: secure_url as string,
						}),
					);
				}
				return product;
			}),
			map((response) => response), // Ensure the response is properly handled
		);
	}

	findAll() {
		return this.productsServiceClient.findAll({});
	}

	findOne(id: string) {
		return this.productsServiceClient.findOne({ id });
	}

	update(
		id: string,
		updateProductDto: UpdateProductDto,
		image?: Express.Multer.File,
	) {
		return this.productsServiceClient.update({ id, ...updateProductDto }).pipe(
			switchMap(async (product: Product) => {
				if (image) {
					const { secure_url } = await this.cdnService.uploadImage(
						image,
						product.id,
						'products',
					);
					return await lastValueFrom(
						this.productsServiceClient.update({
							...product, // Spread the existing product properties
							category_id: product.category.id,
							manufacturer_id: product.manufacturer.id,
							image_url: secure_url as string,
						}),
					);
				}
				return product;
			}),
			map((response) => response), // Ensure the response is properly handled
		);
	}

	remove(id: string) {
		return this.productsServiceClient.remove({ id });
	}

	async permanentlyRemove(id: string) {
		return this.productsServiceClient.permanentlyRemove({ id }).pipe(
			switchMap(async () => {
				await this.cdnService.deleteImage(id);
				return id;
			}),
		);
	}
}
