import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

export class CreateAddressDto {
    user_id: string;

    @IsString()
    @ApiProperty()
    address: string;

    @IsString()
    @ApiProperty()
    city: string;

    @IsString()
    @ApiProperty()
    state: string;

    @IsString()
    @ApiProperty()
    country: string;

    @IsString()
    @ApiProperty()
    postal_code: string;

    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty()
    is_primary: boolean;
  }
  