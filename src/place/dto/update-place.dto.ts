import { IsBoolean, IsString } from "class-validator";

export class UpdatePlaceDto {
    @IsString()
    name: string;

    @IsBoolean()
    show_on_totem: boolean;
}
