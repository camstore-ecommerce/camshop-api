import { IsEmail, IsString } from "class-validator";
import { User } from "../users";
import { ApiProperty } from "@nestjs/swagger";

export class UserLoginDto {
    @IsEmail()
	@ApiProperty()
	email: string;

    @IsString()
	@ApiProperty()
	password: string;
}

export interface UserLoginResponse {
	token: string;
	expires: Date;
	user: User | undefined;
}
