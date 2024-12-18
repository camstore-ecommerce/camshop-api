import { Pagination } from "@app/common/interfaces";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ProductAttribute } from "./product.dto";

export class FilterProductDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    category_id: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    manufacturer_id: string;

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @ApiPropertyOptional({ type: [ProductAttribute] })
    @IsOptional()
    attributes: ProductAttribute[];

    @IsOptional()
    pagination: Pagination;
}