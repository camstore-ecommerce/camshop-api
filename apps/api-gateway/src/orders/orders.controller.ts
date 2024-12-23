import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from '@app/contracts/orders';
import { JwtAuthGuard } from '@app/common/guards';
import { AuthUser, Public, Roles } from '@app/common/decorators';
import { UserDto } from '@app/contracts/users';
import { Role } from '@app/common/enums';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrderDto, OrdersDto } from './dto/order.dto';
import { ApiDocsPagination } from '@app/common/decorators/swagger-form-data.decorators';
import { Pagination } from '@app/common/interfaces';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) { }

	@Post()
	@Public()
	@ApiOperation({ summary: 'Create order', description: 'User access' })
	@ApiResponse({ status: 201, type: OrderDto })
	create(@Body() createOrderDto: CreateOrderDto, @AuthUser() user: UserDto) {
		return this.ordersService.create({ ...createOrderDto, user_id: user?.id });
	}

	@Get()
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Get all orders', description: 'Admin access' })
	@ApiResponse({ status: 200, type: OrdersDto })
	@ApiDocsPagination('order')
	findAll(@Query() query: Pagination) {
		return this.ordersService.findAll(query);
	}

	@Get('/me')
	@Roles(Role.User)
	@ApiOperation({ summary: 'Get all orders by user', description: 'User access' })
	@ApiResponse({ status: 200, type: OrdersDto })
	@ApiDocsPagination('order')
	findAllByUser(@AuthUser() user: UserDto, @Query() query: Pagination) {
		return this.ordersService.findAllByUser({ user_id: user.id, pagination: query });
	}

	@Get('/me/:id')
	@Roles(Role.User)
	@ApiOperation({ summary: 'Get order by user', description: 'User access' })
	@ApiResponse({ status: 200, type: OrderDto })
	findOneByUser(@Param('id') id: string, @AuthUser() user: UserDto) {
		return this.ordersService.findOneByUser(id, user.id);
	}

	@Patch(':user_id/:id')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Update order', description: 'Update order by id. Admin access' })
	@ApiResponse({ status: 200, type: OrderDto })
	update(
		@Param('id') id: string,
		@Body() updateOrderDto: UpdateOrderDto,
		@Param('user_id') user: string,
	) {
		return this.ordersService.update(id, {
			...updateOrderDto,
			user_id: user,
		});
	}

	@Get(':id')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Get order by id', description: 'Admin access' })
	@ApiResponse({ status: 200, type: OrderDto })
	findOne(@Param('id') id: string) {
		return this.ordersService.findOne(id);
	}

	@Delete(':id')
	@Roles(Role.Admin)
	@ApiOperation({ summary: 'Delete order by id', description: 'Admin access' })
	@ApiResponse({ status: 204, description: 'Order deleted' })
	remove(@Param('id') id: string) {
		return this.ordersService.remove(id);
	}
}
