import {FeedArticlesQuery} from "./feed-articles.query";
import {IsOptional, IsString} from "class-validator";


export class ArticlesQuery extends FeedArticlesQuery {

    @IsOptional()
    @IsString()
    tag?: string

    @IsOptional()
    @IsString()
    author?: string

    @IsOptional()
    @IsString()
    favoritedBy: string

}