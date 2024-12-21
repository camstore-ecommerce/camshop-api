import { PaginationResponse } from "@app/common/interfaces";
import { Address } from "../addresses";
import { Inventory } from "../inventory";
import { User } from "../users";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class UserAddress {
	@ApiProperty()
	@IsString()
	first_name: string;

	@ApiProperty()
	@IsString()
	last_name: string;

	@ApiProperty()
	@IsString()
	address: string;
  
	@ApiProperty()
	@IsString()
	city: string;
  
	@ApiProperty()
	@IsString()
	province: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	company?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	apartment?: string;
  
	@ApiProperty()
	@IsString()
	country: string;

	@ApiProperty()
	@IsString()
	postal_code: string;

	@ApiProperty()
	@IsPhoneNumber()
	phone: string;
}


export interface Order {
	id: string;
	user?: User;
	email?: string;
	status: string;
	order_date: Date | undefined;
	updated_at: Date | undefined;
	order_items: OrderItems[];
	address?: Address;
	user_address?: UserAddress;
	shipping_method: string;
	sub_total: number;
	total: number;
	notes: string;
	canceled_reason: string;
	refund_details: string;
}

export interface Orders {
	orders: Order[];
	pagination: PaginationResponse;
}

export interface OrderItems {
	inventory: Inventory;
	qty: number;
	price: number;
	total_price: number;
}