import {IsEmail, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength} from "class-validator";


export class CreateUserDto {

    @IsString()
    username: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(8, {message: 'requires at least 8 characters'})
    @MaxLength(32, {message: 'requires at most 32 characters'})
    @Matches('[A-Z]', '', {message: 'requires upper-case characters'})
    @Matches('[a-z]','', {message: 'requires lower-case characters'})
    @Matches('\\d', '', {message: 'requires numbers'})
    @Matches('\\W', '', {message: 'requires non alpha numeric characters'})
    password: string

    @IsOptional()
    @IsString()
    bio?: string

    @IsOptional()
    @IsUrl()
    imageUrl?: string

}
