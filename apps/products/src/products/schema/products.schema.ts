import { AbstractDocument } from '@app/common/database';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Category } from '../../categories/schema/categories.schema';
import { Manufacturer } from '../../manufacturers/schema/manufacturers.schema';

@Schema({
	versionKey: false,
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
})
export class Product extends AbstractDocument {
	@Prop({ required: true })
	name: string;

	@Prop({ default: '' })
	description: string;

	@Prop({ default: null })
	price: number;

	@Prop({ required: true })
	original_price: number;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	})
	category: Category;

	@Prop({ type: [String], default: [] })
	tags?: string[];

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Manufacturer',
		required: true,
	})
	manufacturer: Manufacturer;

	@Prop({ default: 0 })
	stock: number;

	@Prop({ default: '' })
	image_url: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
