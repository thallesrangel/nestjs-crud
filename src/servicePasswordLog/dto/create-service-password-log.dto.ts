import { IsNumber, IsOptional, IsString } from "class-validator";
import { PasswordStatus } from "src/enums/service-passowrd-status.enum";
import { PasswordTypeLog } from "src/enums/service-password-type-log.enum";

export class CreateServicePasswordLogDTO {
    @IsNumber()
    id_service_password_group: number;

    @IsNumber()
    id_password_service: number;
    
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
    type: PasswordTypeLog;

    @IsOptional()
    status?: PasswordStatus;
}
