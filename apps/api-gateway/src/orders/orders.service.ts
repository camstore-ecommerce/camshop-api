import { ORDERS_CLIENT } from '@app/common/constants/services';
import {
	CreateOrderDto,
	FindAllOrderByUserDto,
	ORDERS_SERVICE_NAME,
	Order,
	OrdersServiceClient,
	UpdateOrderDto,
	UserAddress,
} from '@app/contracts/orders';
import { BadRequestException, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { OrderDto, OrdersDto } from './dto/order.dto';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Struct } from '@app/common/interfaces/struct';
import { Pagination } from '@app/common/interfaces';

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

	private mapOrder(order: Order): OrderDto {
		if (order.user_address) {
			order.user_address = Struct.wrap(order.user_address as any) as any;
		}
		return {
			id: order.id,
			user: {
				id: order.user?.id,
				email: order.user?.email ?? order?.email,
			},
			order_date: order.order_date,
			status: order.status,
			address: {
				id: order.address?.id,
				address: order.address?.address ?? order.user_address?.address,
				city: order.address?.city ?? order.user_address?.city,
				province: order.address?.province ?? order.user_address?.province,
				country: order.address?.country ?? order.user_address?.country,
				postal_code: order.address?.postal_code ?? order.user_address?.postal_code,
				phone: order.user?.phone ?? order.user_address?.phone,
				first_name: order.user?.first_name ?? order.user_address?.first_name,
				last_name: order.user?.last_name ?? order.user_address?.last_name,
				company: order.user_address?.company,
				apartment: order.user_address?.apartment,
			},
			shipping_method: order.shipping_method,
			sub_total: order.sub_total,
			total: order.total,
			notes: order.notes,
			canceled_reason: order.canceled_reason,
			refund_details: order.refund_details,
			updated_at: order.updated_at,
			order_items: order.order_items.map((item) => ({
				...item,
				inventory: {
					id: item.inventory.id,
					name: item.inventory.product.name,
					image_url: item.inventory.product.image_url,
					barcode: item.inventory.barcode,
					serial: item.inventory.serial,
					sku: item.inventory.sku,
					price: item.inventory.price,
				},
			})),
		};
	}

	create(createOrderDto: CreateOrderDto): Observable<OrderDto> {
		if (!createOrderDto.user_address && !createOrderDto.address_id) {
			throw new BadRequestException('Address is required');
		}

		if (!createOrderDto.email && !createOrderDto.user_id) {
			throw new BadRequestException('User is required');
		}

		if (!createOrderDto.order_items || createOrderDto.order_items.length === 0) {
			throw new BadRequestException('Order items are required');
		}

		if (createOrderDto.order_items.some((item) => !item.inventory_id || !item.qty)) {
			throw new BadRequestException('Inventory qty must be greater than 0');
		}

		createOrderDto.user_address = Struct.wrap(createOrderDto.user_address as any) as any;
		return this.ordersServiceClient
			.create(createOrderDto)
			.pipe(
				map((order) => this.mapOrder(order)),
				catchError((error) => {
					return throwError(() => new BadRequestException(error.message));
				})
			);
	}

	findAll(pagination: Pagination): Observable<OrdersDto> {
		console.log('pagination', pagination);
		return this.ordersServiceClient.findAll(pagination).pipe(
			map((orders) => ({
				orders: orders.orders.map((order) => this.mapOrder(order)),
				pagination: orders.pagination,
			})),
		);
	}

	findAllByUser(findAllByUser: FindAllOrderByUserDto): Observable<OrdersDto> {
		return this.ordersServiceClient
			.findAllByUser(findAllByUser)
			.pipe(
				map((orders) => ({
					orders: orders.orders.map((order) => this.mapOrder(order)),
					pagination: orders.pagination,
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
