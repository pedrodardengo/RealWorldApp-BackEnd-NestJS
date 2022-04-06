import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common"
import { CreateArticleDto } from "../dto/create-article.dto"
import { TagsService } from "./tags.service"
import { ExposedArticleDto } from "../dto/exposed-article.dto"
import { ProfileDto } from "../../users/dto/profile.dto"
import { UsersRepository } from "../../users/repositories/users.repository"
import { ArticlesRepository } from "../repositories/articles.repository"
import { ArticlesQuery } from "../types/articles.query"
import { ListArticlesDto } from "../dto/list-articles.dto"
import { FeedArticlesQuery } from "../types/feed-articles.query"
import {
  ARTICLE_MESSAGES,
  AUTH_MESSAGES
} from "../../exceptions/messages.exceptions"
import { UpdateArticleDto } from "../dto/update-article.dto"
import { createSlug } from "../helper/create-slug.helper"
import { Article } from "../entities/article.entity"

@Injectable()
export class ArticlesService {
  constructor(
    private articlesRepo: ArticlesRepository,
    private usersRepo: UsersRepository,
    private tagsService: TagsService
  ) {}

  async createArticle(
    authorId: number,
    articleDto: CreateArticleDto
  ): Promise<ExposedArticleDto> {
    await this.throwIfTitleExists(articleDto.title)
    const author = await this.usersRepo.findOne(authorId)
    if (!articleDto.tagList) articleDto.tagList = []
    const tags = await this.tagsService.fetchTagsCreatingThoseThatDoesntExist(
      articleDto.tagList
    )
    const article = await this.articlesRepo.createAndSaveArticle(
      articleDto,
      author,
      tags
    )
    const authorProfile = new ProfileDto().mapFromUser(author, false)
    return new ExposedArticleDto().mapFromArticleAndAuthor(
      article,
      authorProfile
    )
  }

  async getArticle(
    requestingUserId: number,
    slug: string
  ): Promise<ExposedArticleDto> {
    const mixedArticleData = await this.articlesRepo.getArticle(
      requestingUserId,
      slug
    )
    if (!mixedArticleData)
      throw new NotFoundException(ARTICLE_MESSAGES.ARTICLE_NOT_FOUND(slug))
    return new ExposedArticleDto().mapFromMixedData(mixedArticleData)
  }

  async getMostRecentArticles(
    userId: number,
    articleQuery: ArticlesQuery
  ): Promise<ListArticlesDto> {
    const listMixedArticleData = await this.articlesRepo.getMostRecentArticles(
      userId,
      articleQuery
    )
    return new ListArticlesDto().mapFromMixedArticlesList(listMixedArticleData)
  }

  async getFeedOfArticles(
    requestingUserId: number,
    feedArticleQuery: FeedArticlesQuery
  ): Promise<ListArticlesDto> {
    const listMixedArticleData =
      await this.articlesRepo.getMostRecentArticlesFromWhomUserFollows(
        requestingUserId,
        feedArticleQuery
      )
    return new ListArticlesDto().mapFromMixedArticlesList(listMixedArticleData)
  }

  async changeArticleFavoritismStatus(
    toFavorite: boolean,
    requestingUserId: number,
    slug: string
  ): Promise<ExposedArticleDto> {
    const articleId = (await this.findArticleOrThrow(slug)).id
    if (toFavorite)
      await this.articlesRepo.favoriteArticle(requestingUserId, articleId)
    else await this.articlesRepo.unfavoriteArticle(requestingUserId, articleId)
    return await this.getArticle(requestingUserId, slug)
  }

  async updateArticle(
    requestingUserId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto
  ): Promise<ExposedArticleDto> {
    const article = await this.getArticleIfExistsAndAuthorized(
      requestingUserId,
      slug
    )
    if (updateArticleDto.title) slug = createSlug(updateArticleDto.title)
    await this.articlesRepo.update(
      { id: article.id },
      { ...updateArticleDto, slug }
    )
    return await this.getArticle(requestingUserId, slug)
  }

  async deleteArticle(requestingUserId: number, slug: string): Promise<void> {
    const article = await this.getArticleIfExistsAndAuthorized(
      requestingUserId,
      slug
    )
    await this.articlesRepo.delete(article.id)
  }

  private async getArticleIfExistsAndAuthorized(
    requestingUserId: number,
    slug: string
  ): Promise<Article> {
    const article = await this.findArticleOrThrow(slug)
    if (article.author.id != requestingUserId)
      throw new UnauthorizedException(AUTH_MESSAGES.NOT_THE_AUTHOR)
    return article
  }

  private async findArticleOrThrow(slug: string): Promise<Article> {
    try {
      return await this.articlesRepo.findOneOrFail({
        where: { slug },
        relations: ["author"]
      })
    } catch (e) {
      throw new NotFoundException(ARTICLE_MESSAGES.ARTICLE_NOT_FOUND(slug))
    }
  }

  private async throwIfTitleExists(title: string): Promise<void> {
    const doesArticleExists = await this.articlesRepo.count({
      where: { slug: createSlug(title) }
    })
    if (doesArticleExists == 1)
      throw new ConflictException(ARTICLE_MESSAGES.TITLE_ALREADY_EXISTS(title))
  }
}
