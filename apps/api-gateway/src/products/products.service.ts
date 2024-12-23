import { Inject, Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { PRODUCTS_CLIENT } from '@app/common/constants/services';
import {
	ProductsServiceClient,
	PRODUCTS_SERVICE_NAME,
	CreateProductDto,
	UpdateProductDto,
	Product,
	FilterProductDto,
} from '@app/contracts/products';

import { ClientGrpc } from '@nestjs/microservices';
import { CdnService } from '../cdn/cdn.service';
import { lastValueFrom, map, switchMap, throwError, catchError } from 'rxjs';
import { convertEmptyStringsToNull } from '@app/common/utils';
import { Pagination } from '@app/common/interfaces';

@Injectable()
export class ProductsService implements OnModuleInit {
	private productsServiceClient: ProductsServiceClient;

	constructor(
		@Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientGrpc,
		private readonly cdnService: CdnService,
	) { }

	onModuleInit() {
		this.productsServiceClient =
			this.productsClient.getService<ProductsServiceClient>(
				PRODUCTS_SERVICE_NAME,
			);
	}

	/**
	 * Convert form data text to array
	 * @param obj 
	 */
	fromStringToArray(obj: any) {
		for (const key in obj) {
			if (key === 'attributes' && obj[key] && typeof obj[key] === 'string') {
				console.log('obj[key]', obj[key]);
				obj[key] = JSON.parse(`[${obj[key]}]`);
			} else if (key === 'tags' && obj[key] && typeof obj[key] === 'string') {
				obj[key] = obj[key].split(',').map((tag: string) => tag.trim());
			}
		}

	}

	create(createProductDto: CreateProductDto, image?: Express.Multer.File) {
		this.fromStringToArray(createProductDto);
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
							id: product.id,
							image_url: secure_url,
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

	findAll(pagination: Pagination) {
		return this.productsServiceClient.findAll(pagination);
	}

	filter(filterProductDto: FilterProductDto) {
		return this.productsServiceClient.filter(filterProductDto);
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
		updateProductDto = convertEmptyStringsToNull(updateProductDto);
		this.fromStringToArray(updateProductDto);
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
							id: product.id,
							...product, // Spread the existing product properties
							category_id: product.category.id,
							manufacturer_id: product.manufacturer.id,
							image_url: secure_url as string,
						}),
					);
				}
				return product;
			}),
			map((response) => response),
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
