import { ProfileDto } from "../../users/dto/profile.dto"
import { ResponseDTO } from "../../interceptors/dto-response-mapper.interceptor"

export class ExposedCommentDto implements ResponseDTO {
  id: number
  createdAt: Date
  updatedAt: Date
  body: string
  author: ProfileDto

  mapFromMixedData(data: CommentWithProfile): ExposedCommentDto {
    this.id = data.id
    this.body = data.body
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.author = new ProfileDto().build(data.username, data.following, data.bio, data.imageUrl)
    return this
  }

  mapToResponse(data: CommentWithProfile): { comment: ExposedCommentDto } {
    this.mapFromMixedData(data)
    return { comment: this }
  }
}

export interface CommentWithProfile {
  id: number
  body: string
  updatedAt: Date
  createdAt: Date
  username: string
  bio?: string
  imageUrl?: string
  following: boolean
}
