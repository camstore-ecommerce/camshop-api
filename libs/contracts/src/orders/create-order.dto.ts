import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateOrderDto {
    @IsString()
    @IsOptional()
    user_id: string;

    @IsArray()
    @ValidateNested({ each: true })
    order_items: CreateOrderItemsDto[];

    @IsString()
    address_id: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    shipping_cost: number;

    @IsString()
    shipping_method: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    tax: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    discount: number;
}

export class CreateOrderItemsDto {
    @IsString()
    product_id: string;

    @IsNumber()
    @Type(() => Number)
	qty: number;

    @IsNumber()
    @Type(() => Number)
	price: number;

    @IsNumber()
    @Type(() => Number)
	total_price: number;

    @IsOptional()
	options: any;
}