import { IsEmail, IsString } from "class-validator";
import { User } from "../users";

export class UserLoginDto {
    @IsEmail()
	email: string;

    @IsString()
	password: string;
}

export interface UserLoginResponse {
	token: string;
	expires: Date;
	user: User | undefined;
}
