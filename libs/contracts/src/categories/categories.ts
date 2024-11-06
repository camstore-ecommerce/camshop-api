// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.5
//   protoc               v3.20.3
// source: proto/products/categories.proto

/* eslint-disable */
import { Empty } from '@app/common/interfaces';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';

export const protobufPackage = 'products';

export interface CreateCategoryDto {
	name: string;
}

export interface FindOneCategoryDto {
	id: string;
}

export interface UpdateCategoryDto {
	id: string;
	name: string;
}

export interface RemoveCategoryDto {
	id: string;
}

export interface PermanentlyRemoveCategoryDto {
	id: string;
}

export interface Categories {
	count: number;
	categories: Category[];
}

export interface Category {
	_id: Types.ObjectId;
	name: string;
}

export const PRODUCTS_PACKAGE_NAME = 'products';

export interface CategoriesServiceClient {
	create(request: CreateCategoryDto): Observable<Category>;

	findOne(request: FindOneCategoryDto): Observable<Category>;

	findAll(request: Empty): Observable<Categories>;

	update(request: UpdateCategoryDto): Observable<Category>;

	remove(request: RemoveCategoryDto): Observable<Empty>;

	permanentlyRemove(request: PermanentlyRemoveCategoryDto): Observable<Empty>;
}

export interface CategoriesServiceController {
	create(
		request: CreateCategoryDto,
	): Promise<Category> | Observable<Category> | Category;

	findOne(
		request: FindOneCategoryDto,
	): Promise<Category> | Observable<Category> | Category;

	findAll(
		request: Empty,
	): Promise<Categories> | Observable<Categories> | Categories;

	update(
		request: UpdateCategoryDto,
	): Promise<Category> | Observable<Category> | Category;

	remove(
		request: RemoveCategoryDto,
	): Promise<Empty> | Observable<Empty> | Empty;

	permanentlyRemove(
		request: PermanentlyRemoveCategoryDto,
	): Promise<Empty> | Observable<Empty> | Empty;
}

export function CategoriesServiceControllerMethods() {
	return function (constructor: Function) {
		const grpcMethods: string[] = [
			'create',
			'findOne',
			'findAll',
			'update',
			'remove',
			'permanentlyRemove',
		];
		for (const method of grpcMethods) {
			const descriptor: any = Reflect.getOwnPropertyDescriptor(
				constructor.prototype,
				method,
			);
			GrpcMethod('CategoriesService', method)(
				constructor.prototype[method],
				method,
				descriptor,
			);
		}
		const grpcStreamMethods: string[] = [];
		for (const method of grpcStreamMethods) {
			const descriptor: any = Reflect.getOwnPropertyDescriptor(
				constructor.prototype,
				method,
			);
			GrpcStreamMethod('CategoriesService', method)(
				constructor.prototype[method],
				method,
				descriptor,
			);
		}
	};
}

export const CATEGORIES_SERVICE_NAME = 'CategoriesService';