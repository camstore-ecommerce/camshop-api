import {
	CreateOrderDto,
	Order,
	UpdateOrderDto,
	UserAddress,
} from '@app/contracts/orders';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { PRODUCTS_CLIENT, USERS_CLIENT } from '@app/common/constants/services';
import {
	Products,
} from '@app/contracts/products';
import { USERS_SERVICE_NAME, User, UsersServiceClient } from '@app/contracts/users';
import { firstValueFrom } from 'rxjs';
import { ADDRESSES_SERVICE_NAME, Address, AddressesServiceClient } from '@app/contracts/addresses';
import { INVENTORY_SERVICE_NAME, InventoryServiceClient } from '@app/contracts/inventory';
import { Struct } from '@app/common/interfaces/struct';
import { Pagination } from '@app/common/interfaces';
import { handlePagination } from '@app/common/utils';

@Injectable()
export class OrdersService implements OnModuleInit {
	private inventoryServiceClient: InventoryServiceClient;
	private usersServiceClient: UsersServiceClient;
	private addressesServiceClient: AddressesServiceClient;

	constructor(
		private readonly prismaService: PrismaService,
		@Inject(PRODUCTS_CLIENT) private readonly productsClient: ClientGrpc,
		@Inject(USERS_CLIENT) private readonly usersClient: ClientGrpc,
	) { }

	onModuleInit() {
		this.inventoryServiceClient =
			this.productsClient.getService<InventoryServiceClient>(
				INVENTORY_SERVICE_NAME,
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
		try {
			createOrderDto.user_address = Struct.unwrap(createOrderDto.user_address as any) as any;
			const { order_items, ...orderData } = createOrderDto;

			// Get products
			const inventories = await firstValueFrom(
				this.inventoryServiceClient.findByIds({
					ids: order_items.map((item) => item.inventory_id),
				}),
			);

			// Calculate total price for each order item
			order_items.forEach((item) => {
				const inventory = inventories.inventories.find(
					(inventory) => inventory.id === item.inventory_id,
				);

				if (!inventory) {
					throw new RpcException('Inventory not found');
				}

				item.price = inventory.price;
				item.total_price = item.price * item.qty;
			});

			// Get user
			let user: User = undefined;
			if (orderData.user_id) {
				user = await firstValueFrom(
					this.usersServiceClient.findOne({ id: orderData.user_id }),
				);
			}

			// Get address
			let address: Address = undefined;
			if (orderData.address_id) {
				address = await firstValueFrom(
					this.addressesServiceClient.findOne({ id: orderData.address_id, user_id: orderData.user_id }),
				);
			}

			const sub_total = order_items.reduce((acc, item) => acc + item.total_price, 0);
			const order = await this.prismaService.order.create({
				data: {
					...orderData,
					id: this.generateOrderId(),
					sub_total,
					total: sub_total,
					user_address: orderData.user_address as any,
					order_items: {
						create: order_items.map((item) => ({
							inventory_id: item.inventory_id,
							qty: item.qty,
							price: item.price,
							total_price: item.total_price,
						})),
					},
				},
				include: { order_items: true },
			});

			const orderResponse: Order = {
				...order,
				user: user,
				address: address,
				user_address: Struct.wrap(order.user_address as any) as any,
				order_items: order.order_items.map((item) => ({
					...item,
					inventory: inventories.inventories.find(
						(inventory) => inventory.id === item.inventory_id,
					),
				})),
			};

			return orderResponse;
		} catch (error) {
			throw new RpcException(error.message);
		}
	}

	async findAll(pagination: Pagination) {
		const queryOptions = handlePagination(pagination, "id");
		const orders = await this.prismaService.order.findMany({
			where: { deleted_at: null },
			include: { order_items: true },
			skip: queryOptions.offset,
			take: queryOptions.limit,
			orderBy: { [queryOptions.sort]: pagination.order },

		});

		const inventories = await firstValueFrom(
			this.inventoryServiceClient.findByIds({
				ids: orders.flatMap((order) =>
					order.order_items.map((item) => item.inventory_id),
				),
			}),
		);

		const addresses = await firstValueFrom(
			this.addressesServiceClient.findByIds({
				ids: orders
					.map((order) => order.address_id)
					.filter((id) => id !== undefined && id !== null),
			}),
		);

		const users = await firstValueFrom(
			this.usersServiceClient.findByIds(
				{
					ids: orders
						.map((order) => order.user_id)
						.filter((id) => id !== undefined && id !== null)
				}
			));


		const ordersResponse = orders.map((order) => {
			const user = order.user_id ? users.users.find((user) => user.id === order.user_id) : null;
			const address = order.address_id ? addresses.addresses.find((address) => address.id === order.address_id) : null;

			return {
				...order,
				user,
				address,
				user_address: Struct.wrap(order.user_address as any) as any,
				order_items: order.order_items.map((item) => ({
					...item,
					inventory: inventories.inventories.find(
						(inventory) => inventory.id === item.inventory_id
					),
				})),
			};
		});

		return { orders: ordersResponse, pagination: { ...pagination, total: orders.length } };
	}

	async findAllByUser(user_id: string, pagination: Pagination) {
		const queryOptions = handlePagination(pagination, "id");
		const orders = await this.prismaService.order.findMany({
			where: { deleted_at: null, user_id },
			include: { order_items: true },
			skip: queryOptions.offset,
			take: queryOptions.limit,
			orderBy: { [queryOptions.sort]: pagination.order },

		});

		const inventories = await firstValueFrom(
			this.inventoryServiceClient.findByIds({
				ids: orders.flatMap((order) =>
					order.order_items.map((item) => item.inventory_id),
				),
			}),
		);

		const addresses = await firstValueFrom(
			this.addressesServiceClient.findByIds({
				ids: orders
					.map((order) => order.address_id)
					.filter((id) => id !== undefined && id !== null),
			}),
		);

		const users = await firstValueFrom(
			this.usersServiceClient.findByIds(
				{
					ids: orders
						.map((order) => order.user_id)
						.filter((id) => id !== undefined && id !== null)
				}
			));


		const ordersResponse = orders.map((order) => {
			const user = order.user_id ? users.users.find((user) => user.id === order.user_id) : null;
			const address = order.address_id ? addresses.addresses.find((address) => address.id === order.address_id) : null;

			return {
				...order,
				user,
				address,
				user_address: Struct.wrap(order.user_address as any) as any,
				order_items: order.order_items.map((item) => ({
					...item,
					inventory: inventories.inventories.find(
						(inventory) => inventory.id === item.inventory_id
					),
				})),
			};
		});

		return { orders: ordersResponse, pagination: { ...pagination, total: orders.length } };
	}

	async findOne(id: string) {
		const order = await this.prismaService.order.findFirst({
			where: { id },
			include: { order_items: true },
		});

		const inventories = await firstValueFrom(
			this.inventoryServiceClient.findByIds({
				ids: order.order_items.map((item) => item.inventory_id),
			}),
		);

		const user = order.user_id ? await firstValueFrom(
			this.usersServiceClient.findOne({ id: order.user_id })
		) : null;

		const address = order.address_id ? await firstValueFrom(
			this.addressesServiceClient.findOne({ id: order.address_id, user_id: order.user_id }),
		) : null;

		const orderResponse: Order = {
			...order,
			user,
			address,
			user_address: Struct.wrap(order.user_address as any) as any,
			order_items: order.order_items.map((item) => ({
				...item,
				inventory: inventories.inventories.find(
					(inventory) => inventory.id === item.inventory_id,
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

		const inventories = await firstValueFrom(
			this.inventoryServiceClient.findByIds({
				ids: order.order_items.map((item) => item.inventory_id),
			}),
		);

		const user = order.user_id ? await firstValueFrom(
			this.usersServiceClient.findOne({ id: order.user_id })
		) : null;

		const address = order.address_id ? await firstValueFrom(
			this.addressesServiceClient.findOne({ id: order.address_id, user_id: order.user_id }),
		) : null;
		
		const orderResponse: Order = {
			...order,
			user,
			address,
			user_address: Struct.wrap(order.user_address as any) as any,
			order_items: order.order_items.map((item) => ({
				...item,
				inventory: inventories.inventories.find(
					(inventory) => inventory.id === item.inventory_id,
				),
			})),
		};

		return orderResponse;
	}

	async update(id: string, updateOrderDto: UpdateOrderDto) {
		const existOrderItems = await this.prismaService.orderItem.findMany({
			where: { order_id: id },
		});

		let inventories = await firstValueFrom(
			this.inventoryServiceClient.findByIds({
				ids: existOrderItems.map((item) => item.inventory_id),
			}),
		);

		const user = await firstValueFrom(
			this.usersServiceClient.findOne({ id: updateOrderDto.user_id }),
		);

		const order = await this.prismaService.order.update({
			where: { id },
			data: {
				...updateOrderDto,
				user_address: Struct.unwrap(updateOrderDto.address_id as any) as any,
			},
			include: { order_items: true },
		});

		const orderResponse: Order = {
			...order,
			address: order.address_id ? await firstValueFrom(
				this.addressesServiceClient.findOne({ id: order.address_id, user_id: order.user_id }),
			) : null,
			user,
			user_address: Struct.wrap(order.user_address as any) as any,
			order_items: order.order_items.map((item) => ({
				...item,
				inventory: inventories.inventories.find(
					(inventory) => inventory.id === item.inventory_id,
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
		const order = await this.prismaService.order.findFirst({ where: { id } });
		const user = await firstValueFrom(this.usersServiceClient.findOne({ id: order.user_id }));
		if (user) {
			throw new RpcException('Cannot delete order with user');
		}
		return await this.prismaService.order.delete({ where: { id } });
	}
}
