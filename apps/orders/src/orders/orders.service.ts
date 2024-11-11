import {
	CreateOrderDto,
	OrderResponse,
	UpdateOrderDto,
} from '@app/contracts/orders';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ClientGrpc } from '@nestjs/microservices';
import { PRODUCTS_CLIENT, USERS_CLIENT } from '@app/common/constants/services';
import {
	Products,
	PRODUCTS_SERVICE_NAME,
	ProductsServiceClient,
} from '@app/contracts/products';
import { USERS_SERVICE_NAME, UsersServiceClient } from '@app/contracts/users';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService implements OnModuleInit {
	private productsServiceClient: ProductsServiceClient;
	private usersServiceClient: UsersServiceClient;

	constructor(
		private readonly prismaService: PrismaService,
		@Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientGrpc,
		@Inject(USERS_CLIENT) private readonly usersClient: ClientGrpc,
	) {}

	onModuleInit() {
		this.productsServiceClient =
			this.productsClient.getService<ProductsServiceClient>(
				PRODUCTS_SERVICE_NAME,
			);
		this.usersServiceClient =
			this.usersClient.getService<UsersServiceClient>(USERS_SERVICE_NAME);
	}

	private generateOrderId() {
		const date = new Date();
		const year = date.getFullYear().toString().slice(-2);
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		const timestampPart = year + month + day;

		const randomPart = Array.from({ length: 14 - timestampPart.length }, () => {
			return Math.random().toString(36).charAt(2).toUpperCase();
		}).join('');

		return timestampPart + randomPart;
	}

	async create(createOrderDto: CreateOrderDto) {
		const { order_items, ...orderData } = createOrderDto;

		const products = await firstValueFrom(
			this.productsServiceClient.findByIds({
				ids: order_items.map((item) => item.product_id),
			}),
		);
		const user = await firstValueFrom(
			this.usersServiceClient.findOne({ id: orderData.user_id }),
		);

		const order = await this.prismaService.order.create({
			data: {
				...orderData,
				id: this.generateOrderId(),
				total_price: order_items.reduce(
					(acc, item) => acc + item.price * item.qty,
					0,
				),
				total_qty: order_items.reduce((acc, item) => acc + item.qty, 0),
				order_items: {
					create: order_items.map((item) => ({
						product_id: item.product_id,
						qty: item.qty,
						price: item.price,
					})),
				},
			},
			include: { order_items: true },
		});

		const orderResponse: OrderResponse = {
			...order,
			user: user,
			order_items: order.order_items.map((item) => ({
				...item,
				product: products.products.find(
					(product) => product._id.toString() === item.product_id,
				),
			})),
		};

		return orderResponse;
	}

	async findAll() {
		const [orders, count] = await Promise.all([
			this.prismaService.order.findMany({
				where: { deleted_at: null },
				include: { order_items: true },
			}),
			this.prismaService.order.count(),
		]);

		const products = await firstValueFrom(
			this.productsServiceClient.findByIds({
				ids: orders.flatMap((order) =>
					order.order_items.map((item) => item.product_id),
				),
			}),
		);
		const users = await firstValueFrom(this.usersServiceClient.findAll({}));

		const ordersResponse: OrderResponse[] = orders.map((order) => {
			const user = users.users.find((user) => user.id === order.user_id);

			return {
				...order,
				user: user,
				order_items: order.order_items.map((item) => ({
					...item,
					product: products.products.find(
						(product) => product._id.toString() === item.product_id,
					),
				})),
			};
		});

		return { count, orders: ordersResponse };
	}

	async findOne(id: string) {
		const order = await this.prismaService.order.findFirst({
			where: { id },
			include: { order_items: true },
		});

		const products = await firstValueFrom(
			this.productsServiceClient.findByIds({
				ids: order.order_items.map((item) => item.product_id),
			}),
		);
		const user = await firstValueFrom(
			this.usersServiceClient.findOne({ id: order.user_id }),
		);

		const orderResponse: OrderResponse = {
			...order,
			user: user,
			order_items: order.order_items.map((item) => ({
				...item,
				product: products.products.find(
					(product) => product._id.toString() === item.product_id,
				),
			})),
		};

		return orderResponse;
	}

	async update(id: string, updateOrderDto: UpdateOrderDto) {
		const { order_items, ...orderData } = updateOrderDto;

		const existOrderItems = await this.prismaService.orderItem.findMany({
			where: { order_id: id },
		});

		let products: Products = await firstValueFrom(
			this.productsServiceClient.findByIds({
				ids: existOrderItems.map((item) => item.product_id),
			}),
		);

		if (order_items.length) {
			products = await firstValueFrom(
				this.productsServiceClient.findByIds({
					ids: order_items.map((item) => item.product_id),
				}),
			);

			// Delete existing order items
			await this.prismaService.orderItem.deleteMany({
				where: { order_id: id },
			});

			// Create new order items
			await this.prismaService.orderItem.createMany({
				data: order_items.map((item) => ({
					order_id: id,
					product_id: item.product_id,
					qty: item.qty,
					price: item.price,
				})),
			});
		}
		const user = await firstValueFrom(
			this.usersServiceClient.findOne({ id: orderData.user_id }),
		);

		const order = await this.prismaService.order.update({
			where: { id },
			data: {
				...orderData,
				total_price: order_items.reduce(
					(acc, item) => acc + item.price * item.qty,
					0,
				),
				total_qty: order_items.reduce((acc, item) => acc + item.qty, 0),
			},
			include: { order_items: true },
		});

		const orderResponse: OrderResponse = {
			...order,
			user: user,
			order_items: order.order_items.map((item) => ({
				...item,
				product: products.products.find(
					(product) => product._id.toString() === item.product_id,
				),
			})),
		};

		return orderResponse;
	}

	async remove(id: string) {
		return await this.prismaService.order.update({
			where: { id },
			data: { deleted_at: new Date() },
		});
	}

	async permanentlyRemove(id: string) {
		return await this.prismaService.order.delete({ where: { id } });
	}
}
