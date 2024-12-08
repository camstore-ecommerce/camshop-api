import { Category } from '../categories';
import { Manufacturer } from '../manufacturers';
import { ApiProperty } from '@nestjs/swagger';

export class ProductAttribute {
	@ApiProperty()
	key: string;

	@ApiProperty()
	value: string;
}

export class Product {
	@ApiProperty()
	id: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	category: Category;

	@ApiProperty()
	manufacturer: Manufacturer;

	@ApiProperty({ type: [String] })
	tags: string[];

	@ApiProperty({ type: [ProductAttribute] })
	attributes: ProductAttribute[];

	@ApiProperty()
	image_url: string;
}

export class Products {
	@ApiProperty()
	count: number;
	
	@ApiProperty({ type: [Product] })
	products: Product[];
}