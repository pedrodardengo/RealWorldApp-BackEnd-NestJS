import { ExposedArticleDto, MixedArticleData } from "./exposed-article.dto";

export class ListArticlesDto {
  articles: ExposedArticleDto[];
  articlesCount: number;

  build(articles: ExposedArticleDto[]): ListArticlesDto {
    this.articles = articles;
    this.articlesCount = articles.length;
    return this;
  }

  mapFromMixedArticlesList(
    listMixedArticleData: MixedArticleData[]
  ): ListArticlesDto {
    const exposedArticlesList = listMixedArticleData.map((rawObject) =>
      new ExposedArticleDto().mapFromMixedData(rawObject)
    );
    return this.build(exposedArticlesList);
  }
}
