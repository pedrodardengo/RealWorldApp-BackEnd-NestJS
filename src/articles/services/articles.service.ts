import {Injectable, UnauthorizedException} from "@nestjs/common";
import {CreateArticleDto} from "../dto/create-article.dto";
import {TagsService} from "./tags.service";
import {ExposedArticleDto} from "../dto/exposed-article.dto";
import {ProfileDto} from "../../users/dto/profile.dto";
import {UsersRepository} from "../../users/repositories/users.repository";
import {ArticlesRepository} from "../repositories/articles.repository";
import {ArticlesQuery} from "../types/articles.query";
import {ListArticlesDto} from "../dto/list-articles.dto";
import {FeedArticlesQuery} from "../types/feed-articles.query";
import {AUTH_MESSAGES} from "../../exceptions/messages.exceptions";
import {UpdateArticleDto} from "../dto/update-article.dto";
import {createSlug} from "../helper/create-slug.helper";


@Injectable()
export class ArticlesService {

    constructor(
        private articlesRepo: ArticlesRepository,
        private usersRepo: UsersRepository,
        private tagsService: TagsService
    ) {}

    async createArticle(authorId: number, articleDto: CreateArticleDto): Promise<ExposedArticleDto> {
        const author = await this.usersRepo.findOne(authorId)
        const tags = await this.tagsService.fetchTagsCreatingThoseThatDoesntExist(articleDto.tagList)
        const article = await this.articlesRepo.createArticle(articleDto, author, tags)
        const authorProfile = new ProfileDto().mapFromUser(author, false)
        return new ExposedArticleDto().mapFromArticleAndAuthor(article, authorProfile)
    }

    async getArticle(requestingUserId: number, slug: string): Promise<ExposedArticleDto> {
        const mixedArticleData = await this.articlesRepo.getArticle(requestingUserId, slug)
        return new ExposedArticleDto().mapFromMixedData(mixedArticleData)
    }

    async getMostRecentArticles(userId: number, articleQuery: ArticlesQuery): Promise<ListArticlesDto> {
        const listMixedArticleData = await this.articlesRepo.getMostRecentArticles(userId, articleQuery)
        return new ListArticlesDto().mapFromMixedArticlesList(listMixedArticleData)
    }

    async getFeedOfArticles(requestingUserId: number, feedArticleQuery: FeedArticlesQuery): Promise<ListArticlesDto> {
        const listMixedArticleData = await this.articlesRepo.getFeedOfArticles(requestingUserId, feedArticleQuery)
        return new ListArticlesDto().mapFromMixedArticlesList(listMixedArticleData)
    }

    async updateArticle(
        requestingUserId: number,
        slug: string,
        updateArticleDto: UpdateArticleDto
    ): Promise<ExposedArticleDto> {
        const article = await this.articlesRepo.findOne({where: {slug}})
        if (article.author.id != requestingUserId) throw new UnauthorizedException(AUTH_MESSAGES.NOT_THE_AUTHOR)
        await this.articlesRepo.update(article, updateArticleDto)
        if (updateArticleDto.title) slug = createSlug(updateArticleDto.title)
        return await this.getArticle(requestingUserId, slug)
    }

    async deleteArticle(requestingUserId: number, slug: string): Promise<void> {
        const article = await this.articlesRepo.findOne({where: {slug}})
        if (article.author.id != requestingUserId) throw new UnauthorizedException(AUTH_MESSAGES.NOT_THE_AUTHOR)
        await this.articlesRepo.delete(article.id)
    }

    async changeArticleFavoritismStatus(
        favorite: boolean,
        requestingUserId: number,
        slug: string
    ): Promise<ExposedArticleDto> {
        const article = await this.articlesRepo.findOne({where: {slug}})
        if (favorite) await this.articlesRepo.favoriteArticle(requestingUserId, article.id)
        else await this.articlesRepo.unfavoriteArticle(requestingUserId, article.id)
        return await this.getArticle(requestingUserId, slug)
    }
}
