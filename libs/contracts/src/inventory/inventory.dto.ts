import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../products";

export class Inventory {
    @ApiProperty()
    id: string;

    @ApiProperty({type: Product})
    product: Product;

    @ApiProperty()
    price: number;

    @ApiProperty()
    sku: string;

    @ApiProperty()
    barcode: string;

    @ApiProperty()
    serial: string;

    @ApiProperty()
    stock: number;

    @ApiProperty()
    reserved_stock: number;

    @ApiProperty()
    active: boolean;
}

export class Inventories {
    @ApiProperty()
    count: number;

    @ApiProperty({type: [Inventory]})
    inventories: Inventory[];
}