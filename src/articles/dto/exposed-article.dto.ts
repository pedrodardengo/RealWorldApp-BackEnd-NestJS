import { ProfileDto } from "../../users/dto/profile.dto";
import { Article } from "../entities/article.entity";
import { toInteger } from "lodash";

export class ExposedArticleDto {
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  tagList: string[];
  favorited = false;
  favoritesCount = 0;
  author: ProfileDto;

  mapFromArticleAndAuthor(
    article: Article,
    authorProfile: ProfileDto,
    favorited = false,
    favoritesCount = 0
  ): ExposedArticleDto {
    this.slug = article.slug;
    this.description = article.description;
    this.title = article.title;
    this.body = article.body;
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
    this.tagList = article.tagList.map((tag) => tag.name);
    this.author = authorProfile;
    this.favorited = favorited;
    this.favoritesCount = favoritesCount;
    return this;
  }

  mapFromMixedData(rawResult: MixedArticleData): ExposedArticleDto {
    this.slug = rawResult.slug;
    this.title = rawResult.title;
    this.description = rawResult.description;
    this.body = rawResult.body;
    this.favoritesCount = toInteger(rawResult.favoritesCount);
    this.tagList = rawResult.tagList;
    this.createdAt = rawResult.createdAt;
    this.updatedAt = rawResult.updatedAt;
    this.favorited = Boolean(rawResult.favorited);
    this.author = new ProfileDto().build(
      rawResult.username,
      rawResult.following,
      rawResult.bio,
      rawResult.imageUrl
    );
    return this;
  }
}

export interface MixedArticleData {
  slug: string;
  title: string;
  description: string;
  body: string;
  updatedAt: Date;
  createdAt: Date;
  favorited: boolean;
  tagList: string[];
  favoritesCount: string;
  username: string;
  bio: string;
  imageUrl: string;
  following: boolean;
}
