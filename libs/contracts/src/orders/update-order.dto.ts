import { IsOptional, IsString } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class CreateOrderWithoutItemsDto extends OmitType(CreateOrderDto, ['order_items']) {}

export class UpdateOrderDto extends PartialType(CreateOrderWithoutItemsDto) {
    id: string;

    @ApiProperty()
    @IsString()
    status: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    notes: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    canceled_reason: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    refund_details: string;
}
