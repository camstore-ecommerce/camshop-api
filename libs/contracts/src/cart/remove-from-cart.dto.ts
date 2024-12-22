import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RemoveFromCartDto {
    user_id: string;

    @ApiProperty()
    @IsString()
    inventory_id: string;
}