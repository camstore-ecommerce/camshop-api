import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class AddToCartDto {
    user_id: string;

    @ApiProperty()
    @IsString()
    inventory_id: string;

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    quantity: number;
}