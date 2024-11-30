import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateOrderItemsDto {
    @ApiProperty()
    @IsString()
    product_id: string;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
	qty: number;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
	price: number;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
	total_price: number;

    @ApiPropertyOptional()
    @IsOptional()
	options: any;
}

export class CreateOrderDto {
    @IsString()
    @IsOptional()
    user_id: string;

    @ApiProperty({ type: [CreateOrderItemsDto] })
    @IsArray()
    @ValidateNested({ each: true })
    order_items: CreateOrderItemsDto[];

    @ApiProperty()
    @IsString()
    address_id: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    shipping_cost: number;

    @ApiProperty()
    @IsString()
    shipping_method: string;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    tax: number;

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    discount: number;
}