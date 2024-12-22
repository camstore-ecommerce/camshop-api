import { AbstractDocument } from '@app/common/database';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Category extends AbstractDocument {
	@Prop({ required: true, unique: true })
	name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
