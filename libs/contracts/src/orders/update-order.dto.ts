import { IsOptional, IsString } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";
import { OmitType, PartialType } from "@nestjs/mapped-types";

class CreateOrderWithoutItemsDto extends OmitType(CreateOrderDto, ['order_items']) {}

export class UpdateOrderDto extends PartialType(CreateOrderWithoutItemsDto) {
    id: string;

    @IsString()
    status: string;

    @IsString()
    @IsOptional()
    notes: string;

    @IsString()
    @IsOptional()
    canceled_reason: string;

    @IsString()
    @IsOptional()
    refund_details: string;
}
