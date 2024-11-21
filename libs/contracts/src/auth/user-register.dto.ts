import { IsEmail, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { User } from "../users";

export class UserRegisterDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 6,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
    })
    password: string;
    
    @IsPhoneNumber('VN')
    phone: string;
}

export interface UserRegisterResponse {
	message: string;
	user: User | undefined;
}