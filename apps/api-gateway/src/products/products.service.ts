import { Inject, Injectable } from '@nestjs/common';
import { PRODUCTS_CLIENT } from '@app/common/constants/services';

import {
	PRODUCTS_PATTERNS,
	CreateProductDto as ClientCreateProductDto,
	UpdateProductDto as ClientUpdateProductDto,
	ProductDto as ClientProductDto,
} from '@app/contracts/products';

import { ClientProxy } from '@nestjs/microservices';
import { CdnService } from '../cdn/cdn.service';
import { lastValueFrom, map, switchMap } from 'rxjs';

@Injectable()
export class ProductsService {
	constructor(
		@Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientProxy,
		private readonly cdnService: CdnService,
	) {}

	create(
		createProductDto: ClientCreateProductDto,
		image?: Express.Multer.File,
	) {
		return this.productsClient
			.send(PRODUCTS_PATTERNS.CREATE, createProductDto)
			.pipe(
				switchMap(async (product: ClientProductDto) => {
					if (image) {
						const { secure_url } = await this.cdnService.uploadImage(
							image,
							product._id,
							'products',
						);
						return await lastValueFrom(
							this.productsClient.send(PRODUCTS_PATTERNS.UPDATE, {
								id: product._id,
								image_url: secure_url,
							}),
						);
					}
					return product;
				}),
				map((response) => response), // Ensure the response is properly handled
			);
	}

	findAll() {
		return this.productsClient.send(PRODUCTS_PATTERNS.FIND_ALL, {});
	}

	findOne(id: string) {
		return this.productsClient.send(PRODUCTS_PATTERNS.FIND_ONE, id);
	}

	update(
		id: string,
		updateProductDto: ClientUpdateProductDto,
		image?: Express.Multer.File,
	) {
		return this.productsClient
			.send(PRODUCTS_PATTERNS.UPDATE, {
				id,
				...updateProductDto,
			})
			.pipe(
				switchMap(async (product: ClientProductDto) => {
					if (image) {
						const { secure_url } = await this.cdnService.uploadImage(
							image,
							product._id,
							'products',
						);
						return await lastValueFrom(
							this.productsClient.send(PRODUCTS_PATTERNS.UPDATE, {
								id: product._id,
								image_url: secure_url,
							}),
						);
					}
					return product;
				}),
				map((response) => response), // Ensure the response is properly handled
			);
	}

	remove(id: string) {
		return this.productsClient.send(PRODUCTS_PATTERNS.REMOVE, id);
	}

	async permanentlyRemove(id: string) {
		return this.productsClient.send(PRODUCTS_PATTERNS.PERMANENTLY_REMOVE, id).pipe(
			switchMap(async () => {
				await this.cdnService.deleteImage(id);
				return id;
			}),
		);
	}
}
