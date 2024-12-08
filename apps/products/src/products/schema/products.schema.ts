import { AbstractDocument } from '@app/common/database';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Category } from '../../categories/schema/categories.schema';
import { Manufacturer } from '../../manufacturers/schema/manufacturers.schema';

@Schema()
export class ProductAttribute {
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: string;
}

const ProductAttributeSchema = SchemaFactory.createForClass(ProductAttribute);

@Schema({
	versionKey: false,
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
})
export class Product extends AbstractDocument {
	@Prop({ required: true, unique: true })
	name: string;

	@Prop({ default: '' })
	description: string;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	})
	category: Category;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Manufacturer',
		required: true,
	})
	manufacturer: Manufacturer;

	@Prop({ type: [String], default: [] })
	tags: string[];

	@Prop({ type: [ProductAttributeSchema], default: [] })
	attributes: ProductAttribute[];

	@Prop({ default: '' })
	image_url: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);