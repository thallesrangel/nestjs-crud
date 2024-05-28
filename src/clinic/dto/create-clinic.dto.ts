import { IsString} from "class-validator";

export class CreateClinicDTO {
    @IsString()
    name: string;
}
