import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInventoryDto {
    @ApiProperty()
    @IsString()
    product_id: string;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    price: number;

    @ApiProperty()
    @IsString()
    sku: string;

    @ApiProperty()
    @IsString()
    barcode: string;

    @ApiProperty()
    @IsString()
    serial: string;

    @ApiProperty()
    @IsNumber()
    stock: number;

    @ApiPropertyOptional()
    @IsOptional()
    active: boolean;
}