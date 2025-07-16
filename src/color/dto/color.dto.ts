import { IsString } from "class-validator";


export class ColorDto {
    @IsString({
        message:'name is nessecary'
    })
    name:string

    @IsString({
        message:'value is nessecary'
    })
    value:string
}