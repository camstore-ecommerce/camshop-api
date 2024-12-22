import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	first_name: string;

	@ApiProperty()
	last_name: string;

	@ApiProperty()
	role: string;

	@ApiProperty()
	verified_email_at: Date;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	status: string;
}

export class User {
	@ApiProperty()
	id: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	phone: string;

	@ApiProperty()
	first_name: string;

	@ApiProperty()
	last_name: string;

	@ApiProperty()
	verified_email_at: Date;

	@ApiProperty()
	status: string;

	@ApiProperty()
	role: string;

	@ApiProperty()
	gender: unknown | null;

	@ApiProperty()
	birth_date: Date | null;

	@ApiProperty()
	profile_pic: string | null;
}

export class Users {
	@ApiProperty()
	count: number;

	@ApiProperty({ type: [User] })
	users: User[];
}