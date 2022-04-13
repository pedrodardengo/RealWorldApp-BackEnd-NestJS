import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator"
import { PasswordDto } from "../../auth/dto/password.dto"

export class CreateUserDto extends PasswordDto {
  @IsString()
  username: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  bio?: string

  @IsOptional()
  @IsUrl()
  imageUrl?: string
}
