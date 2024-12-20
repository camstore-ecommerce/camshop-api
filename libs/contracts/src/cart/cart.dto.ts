import { ApiProperty } from "@nestjs/swagger";
import { Inventory } from "../inventory";
import { User } from "../users";

export class CartItem {
    @ApiProperty()
    inventory: Inventory;

    @ApiProperty()
    quantity: number;
}

export class Cart {
    @ApiProperty()
    user: User;

    @ApiProperty({type: [CartItem]})
    items: CartItem[];
}
