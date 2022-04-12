import { User } from "../entities/user.entity"
import { ResponseDTO } from "../../interceptors/dto-response-mapper.interceptor"
import { UserWithFollowingInfo } from "../types/users.types"

export class ProfileDto implements ResponseDTO {
  username: string
  following: boolean
  bio?: string
  imageUrl?: string

  mapToResponse(user: UserWithFollowingInfo): { profile: ProfileDto } {
    this.username = user.username
    this.following = user.following
    this.bio = user.bio
    this.imageUrl = user.imageUrl
    return { profile: this }
  }

  build(username: string, following = false, bio?: string, imageUrl?: string): ProfileDto {
    this.username = username
    this.following = Boolean(following)
    this.bio = bio
    this.imageUrl = imageUrl
    return this
  }

  mapFromUser(user: User, following: boolean): ProfileDto {
    this.username = user.username
    this.following = following
    if (user.bio) this.bio = user.bio
    if (user.imageUrl) this.imageUrl = user.imageUrl
    return this
  }
}
