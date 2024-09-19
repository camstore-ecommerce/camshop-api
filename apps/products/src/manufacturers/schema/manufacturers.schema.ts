import { AbstractDocument } from '@app/common/database';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
	versionKey: false,
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at',
	},
})
export class Manufacturer extends AbstractDocument {
	@Prop({ required: true, unique: true })
	name: string;
}

export const ManufacturerSchema = SchemaFactory.createForClass(Manufacturer);
