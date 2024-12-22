import { AbstractDocument } from "@app/common/database";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Product } from "../../products/schema/products.schema";

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})
export class Inventory extends AbstractDocument {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    })
    product: Product;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    sku: string;

    @Prop({ required: true })
    barcode: string;

    @Prop({ required: true })
    serial: string;

    @Prop({ required: true })
    stock: number;

    @Prop({ default: 0 })
    reserved_stock: number;

    @Prop({ default: true })
    active: boolean;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);