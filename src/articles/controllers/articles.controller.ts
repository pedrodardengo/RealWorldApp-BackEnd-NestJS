import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from "@nestjs/common";
import {dataWrapper} from "../../interceptors/data-wrapper.interceptor";
import {ArticlesService} from "../services/articles.service";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CreateArticleDto} from "../dto/create-article.dto";
import {ArticlesQuery} from "../types/articles.query";
import {FeedArticlesQuery} from "../types/feed-articles.query";
import {UpdateArticleDto} from "../dto/update-article.dto";
import {ExposedArticleDto} from "../dto/exposed-article.dto";
import {ListArticlesDto} from "../dto/list-articles.dto";
import {RequestingUserIdPipe} from "../../pipes/requesting-user-id.pipe";


@Controller('/articles')
@UseGuards(JwtAuthGuard)
export class  ArticlesController {

    constructor(
        private articlesService: ArticlesService
    ) {}

    @dataWrapper('article')
    @Post()
    async createArticle(
        @RequestingUserIdPipe() id: number,
        @Body('article'
        ) article: CreateArticleDto): Promise<ExposedArticleDto> {
        return this.articlesService.createArticle(id, article)
    }

    @Get('/feed')
    async getFeedOfArticles(
        @RequestingUserIdPipe() id: number,
        @Query() query: FeedArticlesQuery): Promise<ListArticlesDto> {
        return this.articlesService.getFeedOfArticles(id, query)
    }

    @dataWrapper('article')
    @Get('/:slug')
    async getArticle(
        @RequestingUserIdPipe() id: number,
        @Param('slug') slug: string
    ): Promise<ExposedArticleDto> {
        return await this.articlesService.getArticle(id, slug)
    }

    @Get()
    async getMostRecentArticles(
        @RequestingUserIdPipe() id: number,
        @Query() query: ArticlesQuery
    ): Promise<ListArticlesDto> {
        return await this.articlesService.getMostRecentArticles(id, query)
    }

    @dataWrapper('article')
    @Put('/:slug')
    async updateArticle(
        @RequestingUserIdPipe() id: number,
        @Param('slug') slug: string,
        @Body('article') body: UpdateArticleDto
    ): Promise<ExposedArticleDto> {
        return this.articlesService.updateArticle(id, slug, body)
    }

    @Delete('/:slug')
    async deleteArticle(
        @RequestingUserIdPipe() id: number,
        @Param('slug') slug: string
    ): Promise<void> {
        return this.articlesService.deleteArticle(id, slug)
    }

    @dataWrapper('article')
    @Post('/:slug/favorite')
    async favoriteArticle(
        @RequestingUserIdPipe() id: number,
        @Param('slug') slug: string
    ): Promise<ExposedArticleDto> {
        return await this.articlesService.changeArticleFavoritismStatus(true, id, slug)
    }

    @dataWrapper('article')
    @Delete('/:slug/favorite')
    async unfavoriteArticle(
        @RequestingUserIdPipe() id: number,
        @Param('slug') slug: string
    ): Promise<ExposedArticleDto> {
        return await this.articlesService.changeArticleFavoritismStatus(false, id, slug)
    }
}
