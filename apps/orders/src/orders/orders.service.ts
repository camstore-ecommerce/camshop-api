import {
	CreateOrderDto,
	Order,
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
import { ADDRESSES_SERVICE_NAME, AddressesServiceClient } from '@app/contracts/addresses';

@Injectable()
export class OrdersService implements OnModuleInit {
	private productsServiceClient: ProductsServiceClient;
	private usersServiceClient: UsersServiceClient;
	private addressesServiceClient: AddressesServiceClient;

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

		this.addressesServiceClient = this.usersClient.getService<AddressesServiceClient>(ADDRESSES_SERVICE_NAME);
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

		const address = await firstValueFrom(
			this.addressesServiceClient.findOne({ id: orderData.address_id, user_id: orderData.user_id }),
		);

		const sub_total = order_items.reduce( (acc, item) => acc + item.price * item.qty, 0);

		const order = await this.prismaService.order.create({
			data: {
				...orderData,
				id: this.generateOrderId(),
				sub_total,
				total: (sub_total + orderData.shipping_cost) * (1 + (orderData.tax || 0) / 100) - (orderData.discount || 0),
				order_items: {
					create: order_items.map((item) => ({
						product_id: item.product_id,
						qty: item.qty,
						price: item.price,
						total_price: item.price * item.qty,
						options: JSON.stringify(item.options || {}),
					})),
				},
			},
			include: { order_items: true },
		});

		const orderResponse: Order = {
			...order,
			user: user,
			address: address,
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
		const [orders] = await Promise.all([
			this.prismaService.order.findMany({
				where: { deleted_at: null },
				include: { order_items: true },
			}),
		]);

		const products = await firstValueFrom(
			this.productsServiceClient.findByIds({
				ids: orders.flatMap((order) =>
					order.order_items.map((item) => item.product_id),
				),
			}),
		);

		const addresses = await firstValueFrom(
			this.addressesServiceClient.findByIds({
				ids: orders.map((order) => order.address_id),
			}),
		);

		const users = await firstValueFrom(this.usersServiceClient.findAll({}));


		const ordersResponse: Promise<Order>[] = orders.map(async (order) => {
			const user = users.users.find((user) => user.id === order.user_id);
			const address = addresses.addresses.find((address) => address.id === order.address_id);

			return {
				...order,
				user,
				address,
				order_items: order.order_items.map((item) => ({
					...item,
					product: products.products.find(
						(product) => product._id.toString() === item.product_id,
					),
				})),
			};
		});

		const resolvedOrdersResponse = await Promise.all(ordersResponse);

		return { count: orders.length, orders: resolvedOrdersResponse };
	}

	async findAllByUser(user_id: string) {
		const [orders] = await Promise.all([
			this.prismaService.order.findMany({
				where: { deleted_at: null, user_id },
				include: { order_items: true },
			}),
		]);

		const products = await firstValueFrom(
			this.productsServiceClient.findByIds({
				ids: orders.flatMap((order) =>
					order.order_items.map((item) => item.product_id),
				),
			}),
		);

		const addresses = await firstValueFrom(
			this.addressesServiceClient.findByIds({
				ids: orders.map((order) => order.address_id),
			}),
		);

		const users = await firstValueFrom(this.usersServiceClient.findAll({}));


		const ordersResponse: Promise<Order>[] = orders.map(async (order) => {
			const user = users.users.find((user) => user.id === order.user_id);
			const address = addresses.addresses.find((address) => address.id === order.address_id);

			return {
				...order,
				user,
				address,
				order_items: order.order_items.map((item) => ({
					...item,
					product: products.products.find(
						(product) => product._id.toString() === item.product_id,
					),
				})),
			};
		});

		const resolvedOrdersResponse = await Promise.all(ordersResponse);

		return { count: orders.length, orders: resolvedOrdersResponse };
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

		const address = await firstValueFrom(
			this.addressesServiceClient.findOne({ id: order.address_id, user_id: order.user_id }),
		);

		const orderResponse: Order = {
			...order,
			user: user,
			address: address,
			order_items: order.order_items.map((item) => ({
				...item,
				product: products.products.find(
					(product) => product._id.toString() === item.product_id,
				),
			})),
		};

		return orderResponse;
	}

	async findOneByUser(id: string, user_id: string) {
		const order = await this.prismaService.order.findFirst({
			where: { id, user_id },
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

		const address = await firstValueFrom(
			this.addressesServiceClient.findOne({ id: order.address_id, user_id: order.user_id }),
		);

		const orderResponse: Order = {
			...order,
			user: user,
			address: address,
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
		const existOrderItems = await this.prismaService.orderItem.findMany({
			where: { order_id: id },
		});

		let products: Products = await firstValueFrom(
			this.productsServiceClient.findByIds({
				ids: existOrderItems.map((item) => item.product_id),
			}),
		);

		const user = await firstValueFrom(
			this.usersServiceClient.findOne({ id: updateOrderDto.user_id }),
		);

		const order = await this.prismaService.order.update({
			where: { id },
			data: {
				...updateOrderDto,
			},
			include: { order_items: true },
		});

		const orderResponse: Order = {
			...order,
			address: await firstValueFrom(
				this.addressesServiceClient.findOne({ id: order.address_id, user_id: order.user_id }),
			),
			user,
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
