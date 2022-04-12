import { ProfileDto } from "../../users/dto/profile.dto"
import { toInteger } from "lodash"
import { ResponseDTO } from "../../../interceptors/dto-response-mapper.interceptor"
import { Tag } from "../entities/tag.entity"
import { isString } from "class-validator"

export class ExposedArticleDto implements ResponseDTO {
  slug: string
  title: string
  description: string
  body: string
  createdAt: Date
  updatedAt: Date
  tagList: string[]
  favorited = false
  favoritesCount = 0
  author: ProfileDto

  mapToResponse(mixedArticleData: ArticleWithProfile): { article: ExposedArticleDto } {
    this.mapFromMixedData(mixedArticleData)
    return { article: this }
  }

  mapFromMixedData(rawResult: ArticleWithProfile): ExposedArticleDto {
    this.slug = rawResult.slug
    this.title = rawResult.title
    this.description = rawResult.description
    this.body = rawResult.body
    this.favoritesCount = toInteger(rawResult.favoritesCount)
    this.tagList = rawResult.tagList.map((tag) => (isString(tag) ? tag : tag.name))
    this.createdAt = rawResult.createdAt
    this.updatedAt = rawResult.updatedAt
    this.favorited = Boolean(rawResult.favorited)
    this.author = new ProfileDto().build(
      rawResult.username,
      rawResult.following,
      rawResult.bio,
      rawResult.imageUrl
    )
    return this
  }
}

export interface ArticleWithProfile {
  slug: string
  title: string
  description: string
  body: string
  updatedAt: Date
  createdAt: Date
  favorited: boolean
  tagList: string[] | Tag[]
  favoritesCount: number
  username: string
  bio?: string
  imageUrl?: string
  following: boolean
}
