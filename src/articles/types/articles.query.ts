import {FeedArticlesQuery} from "./feed-articles.query";
import {IsString} from "class-validator";


export class ArticlesQuery extends FeedArticlesQuery {

    @IsString()
    tag?: string

    @IsString()
    author?: string

    @IsString()
    favorited?: string

}