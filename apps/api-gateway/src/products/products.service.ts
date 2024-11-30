import { Inject, Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { PRODUCTS_CLIENT } from '@app/common/constants/services';

import {
	ProductsServiceClient,
	PRODUCTS_SERVICE_NAME,
	CreateProductDto,
	UpdateProductDto,
	Product,
} from '@app/contracts/products';

import { ClientGrpc } from '@nestjs/microservices';
import { CdnService } from '../cdn/cdn.service';
import { lastValueFrom, map, switchMap, throwError, catchError } from 'rxjs';

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
						product._id.toString(),
						'products',
					);
					return await lastValueFrom(
						this.productsServiceClient.update({
							id: product._id.toString(),
							...product, // Spread the existing product properties
							category_id: product.category._id.toString(),
							manufacturer_id: product.manufacturer._id.toString(),
							image_url: secure_url as string,
						}),
					);
				}
				return product;
			}),
			map((response) => response),
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			}),
		);
	}

	findAll() {
		return this.productsServiceClient.findAll({});
	}

	findOne(id: string) {
		return this.productsServiceClient.findOne({ id }).pipe(
			map((response) => response),
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			}),
		);
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
						product._id.toString(),
						'products',
					);
					return await lastValueFrom(
						this.productsServiceClient.update({
							id: product._id.toString(),
							...product, // Spread the existing product properties
							category_id: product.category._id.toString(),
							manufacturer_id: product.manufacturer._id.toString(),
							image_url: secure_url as string,
						}),
					);
				}
				return product;
			}),
			map((response) => response), // Ensure the response is properly handled
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			})
		);
	}

	remove(id: string) {
		return this.productsServiceClient.remove({ id }).pipe(
			map((response) => response),
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			}),
		);
	}

	async permanentlyRemove(id: string) {
		return this.productsServiceClient.permanentlyRemove({ id }).pipe(
			switchMap(async () => {
				await this.cdnService.deleteImage(`camshop/products/${id}`);
				return id;
			}),
		);
	}
}
