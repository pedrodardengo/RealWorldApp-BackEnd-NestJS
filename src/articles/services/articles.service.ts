import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { CreateArticleDto } from "../dto/create-article.dto"
import { TagsService } from "./tags.service"
import { ArticleWithProfile } from "../dto/exposed-article.dto"
import { ProfileDto } from "../../users/dto/profile.dto"
import { UsersRepository } from "../../users/repositories/users.repository"
import { ArticlesRepository } from "../repositories/articles.repository"
import { ArticlesQuery } from "../types/articles.query"
import { FeedArticlesQuery } from "../types/feed-articles.query"
import { ARTICLE_MESSAGES, AUTH_MESSAGES } from "../../exceptions/messages.exceptions"
import { UpdateArticleDto } from "../dto/update-article.dto"
import { createSlug } from "../tools/create-slug.tool"
import { Article } from "../entities/article.entity"

@Injectable()
export class ArticlesService {
  constructor(
    private articlesRepo: ArticlesRepository,
    private usersRepo: UsersRepository,
    private tagsService: TagsService
  ) {}

  async createArticle(authorId: number, articleDto: CreateArticleDto): Promise<ArticleWithProfile> {
    await this.throwIfTitleExists(articleDto.title)
    const author = await this.usersRepo.findOne(authorId)
    if (!articleDto.tagList) articleDto.tagList = []
    const tags = await this.tagsService.fetchTagsCreatingThoseThatDoesntExist(articleDto.tagList)
    const article = await this.articlesRepo.createAndSaveArticle(articleDto, author, tags)
    const authorProfile = new ProfileDto().mapFromUser(author, false)
    return { ...article, ...authorProfile, favorited: false, favoritesCount: 0 }
  }

  async getArticle(requestingUserId: number, slug: string): Promise<ArticleWithProfile> {
    const mixedArticleData = await this.articlesRepo.getArticle(requestingUserId, slug)
    if (!mixedArticleData) throw new NotFoundException(ARTICLE_MESSAGES.ARTICLE_NOT_FOUND(slug))
    return mixedArticleData
  }

  async getMostRecentArticles(userId: number, articleQuery: ArticlesQuery): Promise<ArticleWithProfile[]> {
    return await this.articlesRepo.getMostRecentArticles(userId, articleQuery)
  }

  async getFeedOfArticles(
    requestingUserId: number,
    feedArticleQuery: FeedArticlesQuery
  ): Promise<ArticleWithProfile[]> {
    return await this.articlesRepo.getMostRecentArticlesFromWhomUserFollows(
      requestingUserId,
      feedArticleQuery
    )
  }

  async changeArticleFavoritismStatus(
    toFavorite: boolean,
    requestingUserId: number,
    slug: string
  ): Promise<ArticleWithProfile> {
    const articleId = (await this.findArticleOrThrow(slug)).id
    if (toFavorite) await this.articlesRepo.favoriteArticle(requestingUserId, articleId)
    else await this.articlesRepo.unfavoriteArticle(requestingUserId, articleId)
    return await this.getArticle(requestingUserId, slug)
  }

  async updateArticle(
    requestingUserId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto
  ): Promise<ArticleWithProfile> {
    const article = await this.getArticleIfExistsAndAuthorized(requestingUserId, slug)
    if (updateArticleDto.title) slug = createSlug(updateArticleDto.title)
    await this.articlesRepo.update({ id: article.id }, { ...updateArticleDto, slug })
    return await this.getArticle(requestingUserId, slug)
  }

  async deleteArticle(requestingUserId: number, slug: string): Promise<void> {
    const article = await this.getArticleIfExistsAndAuthorized(requestingUserId, slug)
    await this.articlesRepo.delete(article.id)
  }

  private async getArticleIfExistsAndAuthorized(requestingUserId: number, slug: string): Promise<Article> {
    const article = await this.findArticleOrThrow(slug)
    if (article.author.id != requestingUserId) throw new UnauthorizedException(AUTH_MESSAGES.NOT_THE_AUTHOR)
    return article
  }

  private async findArticleOrThrow(slug: string): Promise<Article> {
    const article = await this.articlesRepo.findOne({ where: { slug }, relations: ["author"] })
    if (!article) throw new NotFoundException(ARTICLE_MESSAGES.ARTICLE_NOT_FOUND(slug))
    return article
  }

  private async throwIfTitleExists(title: string): Promise<void> {
    const doesArticleExists = await this.articlesRepo.count({
      where: { slug: createSlug(title) }
    })
    if (doesArticleExists == 1) throw new ConflictException(ARTICLE_MESSAGES.TITLE_ALREADY_EXISTS(title))
  }
}
