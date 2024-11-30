import { ORDERS_CLIENT } from '@app/common/constants/services';
import {
	CreateOrderDto,
	OrderResponse,
	ORDERS_SERVICE_NAME,
	OrdersServiceClient,
	UpdateOrderDto,
} from '@app/contracts/orders';
import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { OrderDto, OrdersDto } from './dto/order.dto';
import { catchError, map, Observable, throwError } from 'rxjs';
import { error } from 'console';

@Injectable()
export class OrdersService implements OnModuleInit {
	private ordersServiceClient: OrdersServiceClient;

	constructor(
		@Inject(ORDERS_CLIENT) private readonly ordersClient: ClientGrpc,
	) { }

	onModuleInit() {
		this.ordersServiceClient =
			this.ordersClient.getService<OrdersServiceClient>(ORDERS_SERVICE_NAME);
	}

	private mapOrder(order: OrderResponse): OrderDto {
		return {
			id: order.id,
			user: {
				id: order.user.id,
				email: order.user.email,
				phone: order.user.phone,
				first_name: order.user.first_name,
				last_name: order.user.last_name,
			},
			order_date: order.order_date,
			status: order.status,
			address: {
				id: order.address.id,
				address: order.address.address,
				city: order.address.city,
				state: order.address.state,
				country: order.address.country,
				postal_code: order.address.postal_code
			},
			shipping_cost: order.shipping_cost,
			shipping_method: order.shipping_method,
			sub_total: order.sub_total,
			tax: order.tax,
			discount: order.discount,
			total: order.total,
			notes: order.notes,
			canceled_reason: order.canceled_reason,
			refund_details: order.refund_details,
			updated_at: order.updated_at,
			order_items: order.order_items.map((item) => ({
				...item,
				product: {
					_id: item.product._id,
					name: item.product.name,
					image_url: item.product.image_url,
				},
			})),
		};
	}

	create(createOrderDto: CreateOrderDto): Observable<OrderDto> {
		return this.ordersServiceClient
			.create(createOrderDto)
			.pipe(
				map((order) => this.mapOrder(order)),
				catchError((error) => {
					return throwError(() => new BadRequestException(error.message));
				})
			);
	}

	findAll(): Observable<OrdersDto> {
		return this.ordersServiceClient.findAll({}).pipe(
			map((orders) => ({
				count: orders.orders.length,
				orders: orders.orders.map((order) => this.mapOrder(order)),
			})),
		);
	}

	findAllByUser(user_id: string): Observable<OrdersDto> {
		return this.ordersServiceClient
			.findAllByUser({ user_id })
			.pipe(
				map((orders) => ({
					count: orders.orders.length,
					orders: orders.orders.map((order) => this.mapOrder(order)),
				}),
				)
			);
	}

	findOneByUser(id: string, user_id: string) {
		return this.ordersServiceClient
			.findOneByUser({ id, user_id })
			.pipe(
				map((order) => this.mapOrder(order)),
				catchError((error) => {
					return throwError(() => new BadRequestException(error.message));
				})
			);
	}

	findOne(id: string) {
		return this.ordersServiceClient
			.findOne({ id })
			.pipe(
				map((order) => this.mapOrder(order)),
				catchError((error) => {
					return throwError(() => new BadRequestException(error.message));
				})
			);
	}

	update(id: string, updateOrderDto: UpdateOrderDto) {
		return this.ordersServiceClient
			.update({
				id,
				...updateOrderDto,
			})
			.pipe(
				map((order) => this.mapOrder(order)),
				catchError((error) => {
					return throwError(() => new BadRequestException(error.message));
				})
			);
	}

	remove(id: string) {
		return this.ordersServiceClient.remove({ id }).pipe(
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			})
		);
	}

	permanentlyRemove(id: string) {
		return this.ordersServiceClient.permanentlyRemove({ id }).pipe(
			catchError((error) => {
				return throwError(() => new BadRequestException(error.message));
			})
		);
	}
}
