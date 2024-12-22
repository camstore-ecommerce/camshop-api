import { PaginationResponse } from '@app/common/interfaces';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderInventoryDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	image_url: string;

	@ApiProperty()
	sku: string;

	@ApiProperty()
	barcode: string;

	@ApiProperty()
	serial: string;
}

export class OrderUserDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;
}

export class OrderAddressDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	address: string;

	@ApiProperty()
	city: string;

	@ApiProperty()
	province: string;

	@ApiProperty()
	country: string;

	@ApiProperty()
	postal_code: string;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	first_name: string;

	@ApiProperty()
	last_name: string;

	@ApiPropertyOptional()
	company?: string;

	@ApiPropertyOptional()
	apartment?: string;
}

export class OrderItemsDto {
	@ApiProperty({type: OrderInventoryDto})
	inventory: OrderInventoryDto;

	@ApiProperty()
	qty: number;

	@ApiProperty()
	price: number;

	@ApiProperty()
	total_price: number;
}

export class OrderDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	status: string;

	@ApiPropertyOptional({type: OrderUserDto})
	user?: OrderUserDto;

	@ApiProperty()
	order_date: Date;

	@ApiProperty()
	updated_at: Date;

	@ApiProperty({type: OrderAddressDto})
	address: OrderAddressDto;

	@ApiProperty()
	shipping_method: string;

	@ApiProperty()
	sub_total: number;

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
	@ApiProperty({type: OrderDto})
	orders: OrderDto[];

	@ApiProperty({type: PaginationResponse})
	pagination: PaginationResponse;
}