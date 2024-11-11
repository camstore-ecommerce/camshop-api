import { Types } from 'mongoose';

export interface OrdersDto {
	count: number;
	orders: OrderDto[];
}

export interface OrderItemsDto {
	product: OrderProductDto;
	qty: number;
	price: number;
}

export interface OrderDto {
	id: string;
	user: OrderUserDto;
	order_date: Date;
	status: string;
	total_price: number;
	total_qty: number;
	updated_at: Date;
	order_items: OrderItemsDto[];
}

export interface OrderProductDto {
	_id: Types.ObjectId;
	name: string;
	image_url: string;
}

export interface OrderUserDto {
	id: string;
	email: string;
	phone: string;
	first_name: string;
	last_name: string;
}
