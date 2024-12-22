import { IsEmail, IsPhoneNumber, IsString, IsStrongPassword } from "class-validator";
import { User } from "../users";
import { ApiProperty } from "@nestjs/swagger";

export class UserRegisterDto {
    @ApiProperty()
    @IsString()
    first_name: string;

    @ApiProperty()
    @IsString()
    last_name: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
    })
    password: string;
    
    @ApiProperty()
    @IsPhoneNumber('VN')
    phone: string;
}

export interface UserRegisterResponse {
	message: string;
	user: User | undefined;
}