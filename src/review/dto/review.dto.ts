import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class ReviewDto {
    @IsString({message:'text should be string'})
    @IsNotEmpty({message:"text of review is necessary"})
    text:string

    @IsNumber({}, {message: "rating should be a number"})
    @Min(1, { message: 'minimal rating is 1' })
    @Max(5, { message: 'minimal rating is 5' })
    @IsNotEmpty({message: 'rating is necessary'})
    rating:number
}
