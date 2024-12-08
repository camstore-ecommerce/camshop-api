import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { ProductAttribute } from "./product.dto";

export class CreateProductDto {
    @ApiProperty()
    @IsString()
	name: string;

    @ApiPropertyOptional()
    @IsOptional()
	description: string;

    @ApiProperty()
    @IsString()
	category_id: string;

    @ApiPropertyOptional()
    @IsString({ each: true })
    @IsOptional()
	tags: string[];

    @ApiProperty()
    @IsString()
	manufacturer_id: string;

    @ApiPropertyOptional()
    @IsOptional()
    attributes: any;

    @IsString()
    @IsOptional()
	image_url: string;

}