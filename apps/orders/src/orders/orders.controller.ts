import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
	CreateOrderDto,
	FindAllOrderByUserDto,
	FindOneOrderByUserDto,
	FindOneOrderDto,
	Order,
	OrderId,
	Orders,
	OrdersServiceController,
	OrdersServiceControllerMethods,
	UpdateOrderDto,
} from '@app/contracts/orders';
import { Pagination } from '@app/common/interfaces';

@Controller()
@OrdersServiceControllerMethods()
export class OrdersController implements OrdersServiceController {
	constructor(private readonly ordersService: OrdersService) {}

	async create(createOrderDto: CreateOrderDto) {
		return await this.ordersService.create(createOrderDto);
	}

	async findAll(pagination: Pagination) {
		return await this.ordersService.findAll(pagination);
	}

	async findAllByUser(findAllOrderByUserDto: FindAllOrderByUserDto) {
		return this.ordersService.findAllByUser(findAllOrderByUserDto.user_id, findAllOrderByUserDto.pagination);
	}

	async findOneByUser(findOneOrderByUserDto: FindOneOrderByUserDto) {
		return this.ordersService.findOneByUser(findOneOrderByUserDto.id, findOneOrderByUserDto.user_id);
	}

	async findOne(findOneOrderDto: FindOneOrderDto) {
		return this.ordersService.findOne(findOneOrderDto.id);
	}

	async update(updateOrderDto: UpdateOrderDto) {
		return this.ordersService.update(updateOrderDto.id, updateOrderDto);
	}

	async remove(removeOrderDto: OrderId) {
		return await this.ordersService.remove(removeOrderDto.id);
	}

	async permanentlyRemove(
		permanentlyRemoveOrderDto: OrderId,
	) {
		return await this.ordersService.permanentlyRemove(
			permanentlyRemoveOrderDto.id,
		);
	}
}
