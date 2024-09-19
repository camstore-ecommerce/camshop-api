import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CategoryDto } from '../categories';
import { ManufacturerDto } from '../manufacturers';

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
	category: CategoryDto;

	@IsString({ each: true })
	@IsOptional()
	tags?: string[];

	@IsNotEmpty()
	manufacturer: ManufacturerDto;

	@IsNumber()
	@IsOptional()
	stock: number;

	@IsString()
	@IsOptional()
	image_url: string;
}
