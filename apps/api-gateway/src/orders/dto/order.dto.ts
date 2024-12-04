import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class OrderProductDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	image_url: string;
}

export class OrderUserDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	first_name: string;

	@ApiProperty()
	last_name: string;
}

export class OrderAddressDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	address: string;

	@ApiProperty()
	city: string;

	@ApiProperty()
	state: string;

	@ApiProperty()
	country: string;

	@ApiProperty()
	postal_code: string;
}

export class OrderItemsDto {
	@ApiProperty({type: OrderProductDto})
	product: OrderProductDto;

	@ApiProperty()
	qty: number;

	@ApiProperty()
	price: number;

	@ApiProperty()
	total_price: number;

	@ApiProperty()
	options: any;
}

export class OrderDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	status: string;

	@ApiProperty({type: OrderUserDto})
	user: OrderUserDto;

	@ApiProperty()
	order_date: Date;

	@ApiProperty()
	updated_at: Date;

	@ApiProperty({type: OrderAddressDto})
	address: OrderAddressDto;

	@ApiProperty()
	shipping_cost: number;

	@ApiProperty()
	shipping_method: string;

	@ApiProperty()
	sub_total: number;

	@ApiProperty()
	tax: number;

	@ApiProperty()
	discount: number;

	@ApiProperty()
	total: number;

	@ApiProperty()
	notes: string;

	@ApiProperty()
	canceled_reason: string;

	@ApiProperty()
	refund_details: string;

	@ApiProperty({type: OrderItemsDto})
	order_items: OrderItemsDto[];
}

export class OrdersDto {
	@ApiProperty()
	count: number;

	@ApiProperty({type: OrderDto})
	orders: OrderDto[];
}