import { Types } from 'mongoose';
import { Category } from '../categories';
import { Manufacturer } from '../manufacturers';

export class Product {
	_id: Types.ObjectId;
	name: string;
	description: string;
	original_price: number;
	price: number;
	stock: number;
	category: Category;
	tags: string[];
	manufacturer: Manufacturer;
	image_url: string;
}