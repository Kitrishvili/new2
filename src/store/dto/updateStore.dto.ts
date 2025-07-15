import { IsString } from "class-validator";
import { createStoreDto } from "./createStore.dto";


export class UpdateStoreDto extends createStoreDto{
    @IsString({
        message:'description is nessecary'
    })
    description:string
}