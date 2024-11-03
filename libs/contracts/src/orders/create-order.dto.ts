import {
	IsArray,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
	@IsString()
	product_id: string;

	@IsNumber()
	qty: number;

	@IsNumber()
	price: number;
}

export class CreateOrderDto {
	user_id: string;

	@IsOptional()
	@IsString()
	status?: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	order_items: OrderItemDto[];
}
