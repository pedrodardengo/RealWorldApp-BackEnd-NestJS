import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common"
import { dataWrapper } from "../../interceptors/data-wrapper.interceptor"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { CreateCommentDto } from "../dto/create-comment.dto"
import { CommentsService } from "../services/comments.service"
import { ExposedCommentDto } from "../dto/exposed-comment.dto"
import { RequestingUserIdPipe } from "../../pipes/requesting-user-id.pipe"

@Controller("/articles")
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @dataWrapper("comment")
  @Post("/:slug/comments")
  async createComment(
    @RequestingUserIdPipe() id: number,
    @Param("slug") slug: string,
    @Body("comment") comment: CreateCommentDto
  ): Promise<ExposedCommentDto> {
    return await this.commentsService.createComment(id, slug, comment.body)
  }

  @dataWrapper("comments")
  @Get("/:slug/comments")
  async getCommentsFromArticle(
    @RequestingUserIdPipe() id: number,
    @Param("slug") slug: string
  ): Promise<ExposedCommentDto[]> {
    return this.commentsService.getCommentsFromArticle(id, slug)
  }

  @dataWrapper("comment")
  @Delete("/:slug/comments/:id")
  async deleteComment(@RequestingUserIdPipe() requestingUserId: number, @Param("id") id: number): Promise<void> {
    return this.commentsService.deleteComment(requestingUserId, id)
  }
}
