import { ApiProperty } from "@nestjs/swagger";

class CartUserDto {
    @ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	first_name: string;

	@ApiProperty()
	last_name: string;
}

class CartProductDto {
	@ApiProperty()
	id: string

	@ApiProperty()
	name: string;

	@ApiProperty()
	image_url: string;
}

export class CartItem {
    @ApiProperty()
    product: CartProductDto;

    @ApiProperty()
    quantity: number;

    @ApiProperty()
    price: number;
}

export class CartDto {
    @ApiProperty()
    user: CartUserDto;

    @ApiProperty({ type: [CartItem] })
    items: CartItem[];
}
