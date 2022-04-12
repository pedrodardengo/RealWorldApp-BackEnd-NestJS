import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common"
import { ArticlesService } from "../services/articles.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { CreateArticleDto } from "../dto/create-article.dto"
import { ArticlesQuery } from "../types/articles.query"
import { FeedArticlesQuery } from "../types/feed-articles.query"
import { UpdateArticleDto } from "../dto/update-article.dto"
import { ArticleWithProfile, ExposedArticleDto } from "../dto/exposed-article.dto"
import { ListArticlesDto } from "../dto/list-articles.dto"
import { RequestingUserIdPipe } from "../../../pipes/requesting-user-id.pipe"
import { ResponseMapper } from "../../../interceptors/dto-response-mapper.interceptor"

@Controller("/articles")
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @ResponseMapper(ExposedArticleDto)
  @Post()
  async createArticle(
    @RequestingUserIdPipe() id: number,
    @Body("article") article: CreateArticleDto
  ): Promise<ArticleWithProfile> {
    return this.articlesService.createArticle(id, article)
  }

  @ResponseMapper(ListArticlesDto)
  @Get("/feed")
  async getFeedOfArticles(
    @RequestingUserIdPipe() id: number,
    @Query() query: FeedArticlesQuery
  ): Promise<ArticleWithProfile[]> {
    return this.articlesService.getFeedOfArticles(id, query)
  }

  @ResponseMapper(ExposedArticleDto)
  @Get("/:slug")
  async getArticle(
    @RequestingUserIdPipe() id: number,
    @Param("slug") slug: string
  ): Promise<ArticleWithProfile> {
    return await this.articlesService.getArticle(id, slug)
  }

  @ResponseMapper(ListArticlesDto)
  @Get()
  async getMostRecentArticles(
    @RequestingUserIdPipe() id: number,
    @Query() query: ArticlesQuery
  ): Promise<ArticleWithProfile[]> {
    return await this.articlesService.getMostRecentArticles(id, query)
  }

  @ResponseMapper(ExposedArticleDto)
  @Put("/:slug")
  async updateArticle(
    @RequestingUserIdPipe() id: number,
    @Param("slug") slug: string,
    @Body("article") body: UpdateArticleDto
  ): Promise<ArticleWithProfile> {
    return this.articlesService.updateArticle(id, slug, body)
  }

  @Delete("/:slug")
  async deleteArticle(@RequestingUserIdPipe() id: number, @Param("slug") slug: string): Promise<void> {
    return this.articlesService.deleteArticle(id, slug)
  }

  @ResponseMapper(ExposedArticleDto)
  @Post("/:slug/favorite")
  async favoriteArticle(
    @RequestingUserIdPipe() id: number,
    @Param("slug") slug: string
  ): Promise<ArticleWithProfile> {
    return await this.articlesService.changeArticleFavoritismStatus(true, id, slug)
  }

  @ResponseMapper(ExposedArticleDto)
  @Delete("/:slug/favorite")
  async unfavoriteArticle(
    @RequestingUserIdPipe() id: number,
    @Param("slug") slug: string
  ): Promise<ArticleWithProfile> {
    return await this.articlesService.changeArticleFavoritismStatus(false, id, slug)
  }
}
