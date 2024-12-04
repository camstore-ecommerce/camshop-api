import { Address } from "../addresses";
import { Product } from "../products";
import { User } from "../users";

export interface Orders {
	count: number;
	orders: Order[];
}

export interface Order {
	id: string;
	user: User;
	status: string;
	order_date: Date | undefined;
	updated_at: Date | undefined;
	deleted_at: Date | undefined;
	order_items: OrderItems[];
	address: Address;
	shipping_cost: number;
	shipping_method: string;
	sub_total: number;
	tax: number;
	discount: number;
	total: number;
	notes: string;
	canceled_reason: string;
	refund_details: string;
}

export interface OrderItems {
	order_id: string;
	product: Product;
	qty: number;
	price: number;
	total_price: number;
	options: any;
}