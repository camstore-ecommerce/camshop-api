import { Type } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

export class CreateAddressDto {
    @IsString()
    user_id: string;

    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    state: string;

    @IsString()
    country: string;

    @IsString()
    postal_code: string;

    @IsBoolean()
    @Type(() => Boolean)
    is_primary: boolean;
  }
  