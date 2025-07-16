import { IsString } from "class-validator";


export class CategoryDto {
    @IsString({
        message:'name is nessecary'
    })
    title:string

    @IsString({
        message:'description is nessecary'
    })
    description:string
}