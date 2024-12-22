import { ApiProperty } from "@nestjs/swagger";

export class Manufacturer {
	@ApiProperty()
	id: string;
	
	@ApiProperty()
	name: string;
}

export class Manufacturers {
	@ApiProperty()
	count: number;

	@ApiProperty({ type: [Manufacturer] })
	manufacturers: Manufacturer[];
}
