import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty()
    @IsString()
	name: string;

    @ApiPropertyOptional()
    @IsOptional()
	description: string;

    @ApiPropertyOptional()
    @IsOptional()
	price: number;

    @ApiPropertyOptional()
    @IsOptional()
	stock: number;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
	original_price: number;

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
    @IsString()
    @IsOptional()
	image_url: string;
}