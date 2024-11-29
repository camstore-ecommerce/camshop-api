import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
	id: string;

    @ApiProperty()
	email: string;

    @ApiProperty()
	phone: string;

    @ApiProperty()
	role: string;

    @ApiProperty()
	status: string;

    @ApiProperty()
	verified_email_at: Date;
}