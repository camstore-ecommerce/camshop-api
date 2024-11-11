import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from '@app/contracts/orders';
import { JwtAuthGuard } from '@app/common/guards';
import { AuthUser, Roles } from '@app/common/decorators';
import { UserDto } from '@app/contracts/users';
import { Role } from '@app/common/enums';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	@Roles(Role.User)
	create(@Body() createOrderDto: CreateOrderDto, @AuthUser() user: UserDto) {
		return this.ordersService.create({ ...createOrderDto, user_id: user.id });
	}

	@Get()
	findAll() {
		return this.ordersService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.ordersService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateOrderDto: UpdateOrderDto,
		@AuthUser() user: UserDto,
	) {
		return this.ordersService.update(id, {
			...updateOrderDto,
			user_id: user.id,
		});
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.ordersService.remove(id);
	}
}
