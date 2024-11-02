import { Category } from '../categories';
import { ManufacturerDto } from '../manufacturers';

export class ProductDto {
	_id: string;
	name: string;
	description: string;
	price: number;
	original_price: number;
	category: Category;
	tags: string[];
	manufacturer: ManufacturerDto;
	stock: number;
	image_url: string;
}
