import { ORDERS_CLIENT } from '@app/common/constants/services';
import {
	CreateOrderDto,
	OrderResponse,
	ORDERS_SERVICE_NAME,
	OrdersServiceClient,
	UpdateOrderDto,
} from '@app/contracts/orders';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { OrderDto, OrdersDto } from './dto/order.dto';
import { map, Observable } from 'rxjs';

@Injectable()
export class OrdersService implements OnModuleInit {
	private ordersServiceClient: OrdersServiceClient;

	constructor(
		@Inject(ORDERS_CLIENT) private readonly ordersClient: ClientGrpc,
	) {}

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
			total_price: order.total_price,
			total_qty: order.total_qty,
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
			.pipe(map((order) => this.mapOrder(order)));
	}

	findAll(): Observable<OrdersDto> {
		return this.ordersServiceClient.findAll({}).pipe(
			map((orders) => ({
				count: orders.orders.length,
				orders: orders.orders.map((order) => this.mapOrder(order)),
			})),
		);
	}

	findOne(id: string) {
		return this.ordersServiceClient
			.findOne({ id })
			.pipe(map((order) => this.mapOrder(order)));
	}

	update(id: string, updateOrderDto: UpdateOrderDto) {
		return this.ordersServiceClient
			.update({
				id,
				...updateOrderDto,
			})
			.pipe(map((order) => this.mapOrder(order)));
	}

	remove(id: string) {
		return this.ordersServiceClient.remove({ id });
	}

	permanentlyRemove(id: string) {
		return this.ordersServiceClient.permanentlyRemove({ id });
	}
}
