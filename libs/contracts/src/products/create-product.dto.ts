import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	price: number;

	@IsNumber()
	@IsNotEmpty()
	@Type(() => Number)
	original_price: number;

	@IsNotEmpty()
	category_id: string;

	@IsString({ each: true })
	@IsOptional()
	tags?: string[];

	@IsNotEmpty()
	manufacturer_id: string;

	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	stock: number;
}
