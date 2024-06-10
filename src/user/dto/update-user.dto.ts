import { IsEmail, IsEnum, IsOptional, IsString, IsNumber} from "class-validator";
import { Role } from "src/enums/role.enum";

export class UpdateUserDTO {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    password: string;

    @IsOptional()
    @IsEnum(Role)
    role: number;

    @IsOptional()
    @IsString()
    guiche?: string;
}
