import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { CreateCommentDto } from "../dto/create-comment.dto"
import { CommentsService } from "../services/comments.service"
import { CommentWithProfile, ExposedCommentDto } from "../dto/exposed-comment.dto"
import { RequestingUserIdPipe } from "../../../pipes/requesting-user-id.pipe"
import { ResponseMapper } from "../../../interceptors/dto-response-mapper.interceptor"
import { ListCommentsDto } from "../dto/list-comments.dto"

@Controller("/articles")
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @ResponseMapper(ExposedCommentDto)
  @Post("/:slug/comments")
  async createComment(
    @RequestingUserIdPipe() id: number,
    @Param("slug") slug: string,
    @Body("comment") comment: CreateCommentDto
  ): Promise<CommentWithProfile> {
    return await this.commentsService.createComment(id, slug, comment.body)
  }

  @ResponseMapper(ListCommentsDto)
  @Get("/:slug/comments")
  async getCommentsFromArticle(
    @RequestingUserIdPipe() id: number,
    @Param("slug") slug: string
  ): Promise<ExposedCommentDto[]> {
    return this.commentsService.getCommentsFromArticle(id, slug)
  }

  @Delete("/:slug/comments/:id")
  async deleteComment(
    @RequestingUserIdPipe() requestingUserId: number,
    @Param("id") id: number
  ): Promise<void> {
    return this.commentsService.deleteComment(requestingUserId, id)
  }
}
