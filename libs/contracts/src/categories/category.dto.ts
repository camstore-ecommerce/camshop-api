import { ApiProperty } from "@nestjs/swagger";

export class Category {
	@ApiProperty()
	id: string;
	
	@ApiProperty()
	name: string;
}

export class Categories {
	@ApiProperty()
	count: number;

	@ApiProperty({ type: [Category] })
	categories: Category[];
}