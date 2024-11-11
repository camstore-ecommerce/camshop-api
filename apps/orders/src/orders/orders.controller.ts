import { Controller } from '@nestjs/common';
import { OrdersService } from './orders.service';
import {
	CreateOrderDto,
	FindOneOrderDto,
	OrderResponse,
	OrdersResponse,
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

	async create(createOrderDto: CreateOrderDto): Promise<OrderResponse> {
		return await this.ordersService.create(createOrderDto);
	}

	async findAll(): Promise<OrdersResponse> {
		return await this.ordersService.findAll();
	}

	async findOne(findOneOrderDto: FindOneOrderDto): Promise<OrderResponse> {
		return this.ordersService.findOne(findOneOrderDto.id);
	}

	async update(updateOrderDto: UpdateOrderDto): Promise<OrderResponse> {
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
