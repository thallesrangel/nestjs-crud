import { IsNumber, IsOptional, IsString } from "class-validator";
import { PasswordStatus } from "src/enums/service-passowrd-status.enum";
import { PasswordType } from "src/enums/service-password-type.enum";

export class CreateServicePasswordDTO {
    @IsOptional()
    @IsNumber()
    id_service_password_group?: number;

    @IsOptional()
    @IsNumber()
    id_clinic: number;

    @IsOptional()
    @IsNumber()
    id_patient?: number;

    @IsNumber()
    id_place: number;

    @IsOptional()
    @IsNumber()
    number?: number;

    @IsOptional()
    type?: PasswordType;

    @IsOptional()
    status?: PasswordStatus;
}
