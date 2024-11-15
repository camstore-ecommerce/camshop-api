import { Address } from '@app/contracts/addresses';
import { Types } from 'mongoose';

export interface OrdersDto {
	count: number;
	orders: OrderDto[];
}

export interface OrderItemsDto {
	product: OrderProductDto;
	qty: number;
	price: number;
	total_price: number;
	options: any;
}

export interface OrderDto {
	id: string;
	status: string;
	user: OrderUserDto;
	order_date: Date;
	updated_at: Date;
	address: OrderAddressDto;
	shipping_cost: number;
	shipping_method: string;
	sub_total: number;
	tax: number;
	discount: number;
	total: number;
	notes: string;
	canceled_reason: string;
	refund_details: string;
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

export interface OrderAddressDto {
	id: string;
	address: string;
	city: string;
	state: string;
	country: string;
	postal_code: string;
}