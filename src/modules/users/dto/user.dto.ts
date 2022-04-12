import { ResponseDTO } from "../../../interceptors/dto-response-mapper.interceptor"
import { TokenizedUser } from "../types/users.types"

export class UserDto implements ResponseDTO {
  username: string
  email: string
  bio?: string
  imageUrl?: string
  token?: string

  mapToResponse(tokenizedUser: TokenizedUser): { user: UserDto } {
    this.username = tokenizedUser.username
    this.email = tokenizedUser.email
    this.bio = tokenizedUser.bio
    this.imageUrl = tokenizedUser.imageUrl
    this.token = tokenizedUser.token
    return { user: this }
  }
}
