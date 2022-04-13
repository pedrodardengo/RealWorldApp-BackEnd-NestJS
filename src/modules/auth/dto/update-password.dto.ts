import { PasswordDto } from "./password.dto"
import { IsString } from "class-validator"

export class UpdatePasswordDto extends PasswordDto {
  @IsString()
  oldPassword: string
}
