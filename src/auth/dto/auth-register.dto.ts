import { IsEmail, IsEnum, IsOptional, IsString, MinLength, IsNumber } from "class-validator"
import { Role } from "src/enums/role.enum";

export class AuthRegisterDTO {
    @IsOptional({ message: 'O nome da clínica deve ser uma string.' })
    @IsString()
    clinic_name?: string;

    @IsOptional()
    @IsNumber()
    id_clinic?: number;
    
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, { message: 'A senha deve possuir 6 caracteres.' })
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role: number;

    @IsOptional()
    @IsString()
    guiche?: string;
}
