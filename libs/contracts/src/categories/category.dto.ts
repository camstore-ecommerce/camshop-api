import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class Category {
	@ApiProperty()
	_id: Types.ObjectId;
	
	@ApiProperty()
	name: string;
}

export class Categories {
	@ApiProperty()
	count: number;

	@ApiProperty({ type: [Category] })
	categories: Category[];
}