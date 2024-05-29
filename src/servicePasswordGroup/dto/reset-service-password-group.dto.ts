import { IsNumber, IsOptional } from "class-validator";

export class ResetServicePasswordGroupDTO {
    @IsOptional()
    @IsNumber()
    id_clinic: number;
}
