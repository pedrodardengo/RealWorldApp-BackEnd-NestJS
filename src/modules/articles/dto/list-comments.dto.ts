import { ResponseDTO } from "../../../interceptors/dto-response-mapper.interceptor"
import { CommentWithProfile, ExposedCommentDto } from "./exposed-comment.dto"

export class ListCommentsDto implements ResponseDTO {
  comments: ExposedCommentDto[]

  mapToResponse(commentsWithProfile: CommentWithProfile[]): ListCommentsDto {
    this.comments = commentsWithProfile.map((comment) => new ExposedCommentDto().mapFromMixedData(comment))
    return this
  }
}
