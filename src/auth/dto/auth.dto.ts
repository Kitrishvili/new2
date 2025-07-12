import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";


export class AuthDto {
    @IsOptional()
    @IsString()
    name:string

    @IsString({
        message:'missing email'
    })
    @IsEmail()
    email:string

    @MinLength(6, {
        message: 'password should contain more than 6 words'
    })
    @IsString({
        message:'password is nessecary'
    })
    password:string
}