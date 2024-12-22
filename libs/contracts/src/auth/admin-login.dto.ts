import { IsString } from "class-validator";
import { Admin } from "../users";
import { ApiProperty } from "@nestjs/swagger";

export class AdminLoginDto {
	@ApiProperty()
	@IsString()
	username: string;

	@ApiProperty()
	@IsString()
	password: string;
}

export interface AdminLoginResponse {
	token: string;
	expires: Date;
	user: Admin | undefined;
}
