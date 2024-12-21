import { IsArray, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserAddress } from "./order.dto";

export class CreateOrderItemsDto {
    @ApiProperty()
    @IsString()
    inventory_id: string;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
	qty: number;

    price: number;

    total_price: number;
}

export class CreateOrderDto {
    user_id?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ type: [CreateOrderItemsDto] })
    @IsArray()
    @ValidateNested({ each: true })
    order_items: CreateOrderItemsDto[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address_id?: string;

    @ApiPropertyOptional({ type: UserAddress })
    @IsOptional()
    @ValidateNested({ each: true })
    user_address?: UserAddress;

    @ApiProperty()
    @IsString()
    shipping_method: string;
}