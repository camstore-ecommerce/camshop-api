import { ApiProperty } from "@nestjs/swagger";

export class Address {
  @ApiProperty()
  id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  postal_code: string;

  @ApiProperty()
  is_primary: boolean;
}

export class Addresses {
  @ApiProperty()
  count: number;

  @ApiProperty({ type: [Address] })
  addresses: Address[];
}
