import { IsEmail, IsEnum, IsOptional, IsString, IsNumber} from "class-validator";
import { Role } from "src/enums/role.enum";

export class CreateUserDTO {
    @IsOptional()
    @IsNumber()
    id_clinic?: number;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role: number;

    @IsOptional()
    @IsString()
    guiche?: string;
}

// 10:54 - aula43