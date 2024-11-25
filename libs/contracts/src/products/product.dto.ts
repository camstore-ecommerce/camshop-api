import { Types } from 'mongoose';
import { Category } from '../categories';
import { Manufacturer } from '../manufacturers';
import { ApiProperty } from '@nestjs/swagger';

export class Product {
	@ApiProperty()
	_id: Types.ObjectId;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	original_price: number;

	@ApiProperty()
	price: number;

	@ApiProperty()
	stock: number;

	@ApiProperty()
	category: Category;
	
	@ApiProperty()
	manufacturer: Manufacturer;

	@ApiProperty()
	tags: string[];

	@ApiProperty()
	image_url: string;
}

export class Products {
	@ApiProperty()
	count: number;
	
	@ApiProperty({ type: [Product] })
	products: Product[];
}