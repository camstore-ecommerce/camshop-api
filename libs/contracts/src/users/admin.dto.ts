import { ApiProperty } from "@nestjs/swagger";

export class Admin {
	@ApiProperty()
	id: string;

	@ApiProperty()
	username: string;
	
	@ApiProperty()
	admin_level: string;

	@ApiProperty()
	permissions: string[];

	@ApiProperty()
	role: string;
}