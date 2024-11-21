import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
	name: string;

    @IsOptional()
	description: string;

    @IsOptional()
	price: number;

    @IsOptional()
	stock: number;

    @IsNumber()
    @Type(() => Number)
	original_price: number;

    @IsString()
	category_id: string;

    @IsString({ each: true })
    @IsOptional()
	tags: string[];

    @IsString()
	manufacturer_id: string;

    @IsString()
    @IsOptional()
	image_url: string;
}