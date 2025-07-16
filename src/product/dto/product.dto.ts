import { ArrayMinSize, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ProductDto{
    @IsString({message:'title is nessecary'})
    @IsNotEmpty({message:"title can't be empty"})
    title:string

    @IsString({message:'description is nessecary'})
    @IsNotEmpty({message:"description can't be empty"})
    description:string

    @IsNumber({},{message:'price is nessecary'})
    @IsNotEmpty({message:"price can't be empty"})
    price:number

    @IsString({
        message:'choose picture',
        each:true
    })
    @ArrayMinSize(1, { message: 'choose at leas one picture'})
    @IsNotEmpty({
        each:true,
        message:"path to picture can't be mepty"
    })
    images:string[]

    @IsString({
        message:"id of category can't be empty",
        each:true
    })
    categoryId:string
    
    @IsString({message:'color is nessecary'})
    @IsNotEmpty({message: "id of color can't be empty"})
    colorId:string
}