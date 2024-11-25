import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class Manufacturer {
	@ApiProperty()
	_id: Types.ObjectId;
	
	@ApiProperty()
	name: string;
}

export class Manufacturers {
	@ApiProperty()
	count: number;

	@ApiProperty({ type: [Manufacturer] })
	manufacturers: Manufacturer[];
}
