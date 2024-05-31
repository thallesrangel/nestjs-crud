import { IsEmail, IsEnum, IsOptional, IsString, MinLength, IsNumber } from "class-validator"
import { Role } from "src/enums/role.enum";

export class AuthRegisterDTO {
    @IsOptional()
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
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role: number;

    @IsOptional()
    @IsString()
    guiche?: string;
}
