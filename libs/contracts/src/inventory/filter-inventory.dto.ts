import { Pagination } from "@app/common/interfaces";
import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { FilterProductDto } from "../products";
import { Type } from "class-transformer";

class FilterInventoryProductDto extends OmitType(FilterProductDto, ['pagination']) {}

export class FilterInventoryDto {
    @ApiPropertyOptional({ type: FilterInventoryProductDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => FilterInventoryProductDto)
    product: FilterInventoryProductDto;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    price: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Type(() => String)
    sku: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Type(() => String)
    barcode: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @Type(() => String)
    serial: string;

    @ApiPropertyOptional()
    stock: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    reserved_stock: number;

    @IsOptional()
    pagination: Pagination;
}