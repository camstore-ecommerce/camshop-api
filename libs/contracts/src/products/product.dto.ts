import { Category } from '../categories';
import { Manufacturer } from '../manufacturers';
import { ApiProperty } from '@nestjs/swagger';

export class Product {
	@ApiProperty()
	id: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	original_price: number;

	@ApiProperty()
	price: number | null;

	@ApiProperty()
	category: Category;

	@ApiProperty()
	manufacturer: Manufacturer;

	@ApiProperty({ type: [String] })
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