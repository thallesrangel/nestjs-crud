import { IsNumber } from "class-validator";

export class CreateServicePasswordGroupDTO {
    @IsNumber()
    id_clinic: number;
}
