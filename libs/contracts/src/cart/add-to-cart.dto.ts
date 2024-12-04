import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsObject, IsString } from "class-validator";

export class AddToCartDto {
    user_id: string;

    @ApiProperty()
    @IsString()
    product_id: string;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    quantity: number;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    price: number;

    @ApiProperty()
    @IsObject()
    @Type(() => Object)
    options: any;
}