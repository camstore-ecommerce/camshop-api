import { AbstractDocument } from "@app/common/database";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from 'mongoose';

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})
export class Cart extends AbstractDocument {
    @Prop({ required: true, unique: true })
    user_id: string;

    @Prop([
        {
            product_id: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            price: { type: Number, required: true },
        }
    ])
    items: {
        product_id: string;
        quantity: number;
        price: number;
    }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);