import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateInventoryDto } from "./create-inventory.dto";

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
    id: string;
}

export class UpdateReservedStockDto {
    id: string;

    @ApiProperty()
    reserved_stock: number;
}