import { IsBoolean, IsNumber, IsOptional, IsString, IsStrongPassword} from "class-validator";

export class CreatePlaceDTO {
    @IsString()
    name: string;

    @IsOptional()
    @IsBoolean()
    show_on_totem: boolean;
}
