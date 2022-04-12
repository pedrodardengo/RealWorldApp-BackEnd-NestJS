import { ArticleWithProfile, ExposedArticleDto } from "./exposed-article.dto"
import { ResponseDTO } from "../../../interceptors/dto-response-mapper.interceptor"

export class ListArticlesDto implements ResponseDTO {
  articles: ExposedArticleDto[]
  articlesCount: number

  build(articles: ExposedArticleDto[]): ListArticlesDto {
    this.articles = articles
    this.articlesCount = articles.length
    return this
  }

  mapToResponse(listMixedArticleData: ArticleWithProfile[]): ListArticlesDto {
    const exposedArticlesList = listMixedArticleData.map((rawObject) =>
      new ExposedArticleDto().mapFromMixedData(rawObject)
    )
    return this.build(exposedArticlesList)
  }
}
