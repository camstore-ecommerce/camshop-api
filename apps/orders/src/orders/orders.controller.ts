import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
	CreateOrderDto,
	FindAllOrderByUserDto,
	FindOneOrderByUserDto,
	FindOneOrderDto,
	Order,
	Orders,
	OrdersServiceController,
	OrdersServiceControllerMethods,
	PermanentlyRemoveOrderDto,
	RemoveOrderDto,
	UpdateOrderDto,
} from '@app/contracts/orders';

@Controller()
@OrdersServiceControllerMethods()
export class OrdersController implements OrdersServiceController {
	constructor(private readonly ordersService: OrdersService) {}

	async create(createOrderDto: CreateOrderDto): Promise<Order> {
		return await this.ordersService.create(createOrderDto);
	}

	async findAll(): Promise<Orders> {
		return await this.ordersService.findAll();
	}

	async findAllByUser(findAllOrderByUserDto: FindAllOrderByUserDto): Promise<Orders> {
		return this.ordersService.findAllByUser(findAllOrderByUserDto.user_id);
	}

	async findOneByUser(findOneOrderByUserDto: FindOneOrderByUserDto): Promise<Order> {
		return this.ordersService.findOneByUser(findOneOrderByUserDto.id, findOneOrderByUserDto.user_id);
	}

	async findOne(findOneOrderDto: FindOneOrderDto): Promise<Order> {
		return this.ordersService.findOne(findOneOrderDto.id);
	}

	async update(updateOrderDto: UpdateOrderDto): Promise<Order> {
		return this.ordersService.update(updateOrderDto.id, updateOrderDto);
	}

	async remove(removeOrderDto: RemoveOrderDto) {
		return await this.ordersService.remove(removeOrderDto.id);
	}

	async permanentlyRemove(
		permanentlyRemoveOrderDto: PermanentlyRemoveOrderDto,
	) {
		return await this.ordersService.permanentlyRemove(
			permanentlyRemoveOrderDto.id,
		);
	}
}
