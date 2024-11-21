export interface Order {
	id: string;
	user_id: string;
	status: string;
	order_date: Date | undefined;
	updated_at: Date | undefined;
	deleted_at: Date | undefined;
	order_items: OrderItems[];
	address_id: string;
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
	product_id: string;
	qty: number;
	price: number;
	total_price: number;
	options: any;
}