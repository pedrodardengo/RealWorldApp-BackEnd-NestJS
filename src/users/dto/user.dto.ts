import { Expose } from "class-transformer"
import { PartialType } from "@nestjs/mapped-types"
import { User } from "../entities/user.entity"

export class UserDto extends PartialType(User) {
  @Expose()
  username: string

  @Expose()
  email: string

  @Expose()
  bio?: string

  @Expose()
  imageUrl?: string

  @Expose()
  token?: string
}
