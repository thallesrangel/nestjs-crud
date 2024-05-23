import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword} from "class-validator";
import { Role } from "src/enums/role.enum";

export class CreateUserDTO {

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role: number;
}

// 10:54 - aula43