import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards} from "@nestjs/common";
import {dataWrapper} from "../../interceptors/data-wrapper.interceptor";
import {ArticlesService} from "../services/articles.service";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CreateArticleDto} from "../dto/create-article.dto";
import {ArticlesQuery} from "../types/articles.query";
import {FeedArticlesQuery} from "../types/feed-articles.query";
import {UpdateArticleDto} from "../dto/update-article.dto";
import {ExposedArticleDto} from "../dto/exposed-article.dto";
import {ListArticlesDto} from "../dto/list-articles.dto";


@Controller('/articles')
@UseGuards(JwtAuthGuard)
export class  ArticlesController {

    constructor(
        private articlesService: ArticlesService
    ) {}


    @dataWrapper('article')
    @Get('/:slug')
    async getArticle(@Request() req, @Param('slug') slug: string): Promise<ExposedArticleDto> {
        return await this.articlesService.getArticle(req.id, slug)
    }

    @dataWrapper('article')
    @Post()
    async createArticle(
        @Request() req,
        @Body('article'
        ) article: CreateArticleDto): Promise<ExposedArticleDto> {
        return this.articlesService.createArticle(req.id, article)
    }

    @Get()
    async getMostRecentArticles(@Request() req, @Query() query: ArticlesQuery): Promise<ListArticlesDto> {
        return await this.articlesService.getMostRecentArticles(req.id, query)
    }

    @Get('/feed')
    async getFeedOfArticles(@Request() req, @Query() query: FeedArticlesQuery): Promise<ListArticlesDto> {
        return this.articlesService.getFeedOfArticles(req.id, query)
    }

    @dataWrapper('article')
    @Put('/:slug')
    async updateArticle(
        @Request() req,
        @Param('slug') slug: string,
        @Body('article') body: UpdateArticleDto
    ): Promise<ExposedArticleDto> {
        return this.articlesService.updateArticle(req.id, slug, body)
    }

    @Delete('/:slug')
    async deleteArticle(
        @Request() req,
        @Param('slug') slug: string
    ): Promise<void> {
        return this.articlesService.deleteArticle(req.id, slug)
    }

    @dataWrapper('article')
    @Post('/:slug/favorite')
    async favoriteArticle(@Request() req, @Param('slug') slug: string): Promise<ExposedArticleDto> {
        return await this.articlesService.changeArticleFavoritismStatus(true, req.id, slug)
    }

    @dataWrapper('article')
    @Delete('/:slug/favorite')
    async unfavoriteArticle(@Request() req, @Param('slug') slug: string): Promise<ExposedArticleDto> {
        return await this.articlesService.changeArticleFavoritismStatus(false, req.id, slug)
    }
}
