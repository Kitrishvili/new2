import { IsString } from "class-validator";


export class createStoreDto{
    @IsString({
        message:'title is nessecary'
    })
    title:string
}