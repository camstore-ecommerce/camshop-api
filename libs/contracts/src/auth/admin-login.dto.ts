import { IsString } from "class-validator";
import { Admin } from "../users";

export class AdminLoginDto {
	@IsString()
	username: string;

	@IsString()
	password: string;
}

export interface AdminLoginResponse {
	token: string;
	expires: Date;
	user: Admin | undefined;
}
