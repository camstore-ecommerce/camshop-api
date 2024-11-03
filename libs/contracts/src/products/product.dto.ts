import { Category } from '../categories';
import { Manufacturer } from '../manufacturers';

export class ProductDto {
	_id: string;
	name: string;
	description: string;
	price: number;
	original_price: number;
	category: Category;
	tags: string[];
	manufacturer: Manufacturer;
	stock: number;
	image_url: string;
}
