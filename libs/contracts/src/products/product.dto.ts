import { PaginationResponse } from '@app/common/interfaces';
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
	@ApiProperty({ type: [Product] })
	products: Product[];
	
	@ApiProperty({ type: PaginationResponse })
	pagination: PaginationResponse;
}