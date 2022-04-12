import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, SelectQueryBuilder } from "typeorm"
import { Comment } from "../entities/comment.entity"
import { ArticlesRepository } from "../repositories/articles.repository"
import { UsersRepository } from "../../users/repositories/users.repository"
import { CommentWithProfile } from "../dto/exposed-comment.dto"
import { ProfileDto } from "../../users/dto/profile.dto"
import { Article } from "../entities/article.entity"
import { User } from "../../users/entities/user.entity"
import { FollowRelation } from "../../users/entities/follow-relation.entity"
import { ARTICLE_MESSAGES, AUTH_MESSAGES } from "../../exceptions/messages.exceptions"

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepo: Repository<Comment>,
    private articlesRepo: ArticlesRepository,
    private usersRepo: UsersRepository
  ) {}

  async createComment(authorId: number, slug: string, body: string): Promise<CommentWithProfile> {
    const author = await this.usersRepo.findOne(authorId)
    const profile = new ProfileDto().mapFromUser(author, false)
    const article = await this.articlesRepo.findOne({ where: { slug } })
    if (!article) throw new NotFoundException(ARTICLE_MESSAGES.ARTICLE_NOT_FOUND(slug))
    let comment = this.commentsRepo.create({ body, author, article })
    comment = await this.commentsRepo.save(comment)
    return { ...profile, ...comment }
  }

  async deleteComment(requestingUserId: number, commentId: number): Promise<void> {
    const comment = await this.commentsRepo.findOne(commentId, {
      relations: ["author"]
    })
    if (comment.author.id != requestingUserId) throw new UnauthorizedException(AUTH_MESSAGES.NOT_THE_AUTHOR)
    await this.commentsRepo.delete(commentId)
  }

  async getCommentsFromArticle(requestingUserId: number, slug: string) {
    const article = await this.articlesRepo.findOne({ where: { slug } })
    if (!article) throw new NotFoundException(ARTICLE_MESSAGES.ARTICLE_NOT_FOUND(slug))
    const existsQuery = <T>(builder: SelectQueryBuilder<T>) => `EXISTS (${builder.getQuery()})`
    return await this.commentsRepo.manager
      .createQueryBuilder()
      .from(Comment, "Comment")
      .select([
        'Comment.createdAt AS "createdAt"',
        'Comment.updatedAt AS "updatedAt"',
        'Comment.body AS "body"',
        "Author.username as username",
        'Author.bio AS "bio"',
        'Author.imageUrl AS "imageUrl"',
        "Comment.id AS id"
      ])
      .innerJoin(Article, "Article", "Article.id = Comment.articleId")
      .innerJoin(User, "Author", "Author.id = Comment.authorId")
      .where("Article.slug = :slug", { slug })
      .addSelect(
        (qb) =>
          qb.select(
            existsQuery(
              qb
                .from(FollowRelation, "FR")
                .innerJoin(User, "U", "U.id = FR.followerId")
                .where("FR.userId = Author.id AND U.id = :requestingUserId", {
                  requestingUserId
                })
            )
          ),
        "following"
      )
      .getRawMany()
  }
}
