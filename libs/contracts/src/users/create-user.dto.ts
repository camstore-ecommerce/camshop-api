import {
    IsEmail,
    IsOptional,
    IsPhoneNumber,
    IsString,
    IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({ minLength: 6, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0 })
    password: string;

    @IsPhoneNumber('VN')
    phone: string;

    @IsOptional()
    @IsString()
    status?: string;
}
