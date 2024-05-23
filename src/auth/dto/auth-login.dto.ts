import { IsEmail, IsString, MinLength } from "class-validator"

export class AuthLoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}