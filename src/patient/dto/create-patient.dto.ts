import { IsNumber, IsString } from "class-validator";

export class CreatePatientDTO {
    @IsNumber()
    id_clinic: number;

    @IsString()
    name: string;
}
