// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.5
//   protoc               v3.20.3
// source: proto/orders/orders.proto

/* eslint-disable */
import { Empty } from '@app/common/interfaces';
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { User } from '../auth';
import { Product } from '../products';

export const protobufPackage = 'orders';

export interface FindOneOrderDto {
	id: string;
}

export interface CreateOrderDto {
	user_id: string;
	order_items: OrderItems[];
}

export interface UpdateOrderDto {
	id: string;
	user_id: string;
	status: string;
	order_items: OrderItems[];
}

export interface RemoveOrderDto {
	id: string;
}

export interface PermanentlyRemoveOrderDto {
	id: string;
}

export interface Order {
	id: string;
	user_id: string;
	order_date: Date;
	status: string;
	total_price: number;
	total_qty: number;
	created_at: Date;
	updated_at: Date;
	order_items: OrderItems[];
}

export interface OrderItems {
	order_id: string;
	product_id: string;
	qty: number;
	price: number;
}

export interface OrdersResponse {
	count: number;
	orders: OrderResponse[];
}

export interface OrderResponse {
	id: string;
	user: User;
	order_date: Date;
	status: string;
	total_price: number;
	total_qty: number;
	created_at: Date;
	updated_at: Date;
	order_items: OrderItemsResponse[];
}

export interface OrderItemsResponse {
	order_id: string;
	product: Product;
	qty: number;
	price: number;
}

export const ORDERS_PACKAGE_NAME = 'orders';

export interface OrdersServiceClient {
	findOne(request: FindOneOrderDto): Observable<OrderResponse>;

	findAll(request: Empty): Observable<OrdersResponse>;

	create(request: CreateOrderDto): Observable<OrderResponse>;

	update(request: UpdateOrderDto): Observable<OrderResponse>;

	remove(request: RemoveOrderDto): Observable<Empty>;

	permanentlyRemove(request: PermanentlyRemoveOrderDto): Observable<Empty>;
}

export interface OrdersServiceController {
	findOne(
		request: FindOneOrderDto,
	): Promise<OrderResponse> | Observable<OrderResponse> | OrderResponse;

	findAll(
		request: Empty,
	): Promise<OrdersResponse> | Observable<OrdersResponse> | OrdersResponse;

	create(
		request: CreateOrderDto,
	): Promise<OrderResponse> | Observable<OrderResponse> | OrderResponse;

	update(
		request: UpdateOrderDto,
	): Promise<OrderResponse> | Observable<OrderResponse> | OrderResponse;

	remove(request: RemoveOrderDto): Promise<Empty> | Observable<Empty> | Empty;

	permanentlyRemove(
		request: PermanentlyRemoveOrderDto,
	): Promise<Empty> | Observable<Empty> | Empty;
}

export function OrdersServiceControllerMethods() {
	return function (constructor: Function) {
		const grpcMethods: string[] = [
			'findOne',
			'findAll',
			'create',
			'update',
			'remove',
			'permanentlyRemove',
		];
		for (const method of grpcMethods) {
			const descriptor: any = Reflect.getOwnPropertyDescriptor(
				constructor.prototype,
				method,
			);
			GrpcMethod('OrdersService', method)(
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
			GrpcStreamMethod('OrdersService', method)(
				constructor.prototype[method],
				method,
				descriptor,
			);
		}
	};
}

export const ORDERS_SERVICE_NAME = 'OrdersService';
