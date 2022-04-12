import { EntityRepository, Repository, SelectQueryBuilder } from "typeorm"
import { Article } from "../entities/article.entity"
import { CreateArticleDto } from "../dto/create-article.dto"
import { User } from "../../users/entities/user.entity"
import { Tag } from "../entities/tag.entity"
import { ArticlesQuery } from "../types/articles.query"
import { FollowRelation } from "../../users/entities/follow-relation.entity"
import { isString } from "class-validator"
import { MixedArticleData } from "../dto/exposed-article.dto"
import { FeedArticlesQuery } from "../types/feed-articles.query"

@EntityRepository(Article)
export class ArticlesRepository extends Repository<Article> {
  async createAndSaveArticle(articleDto: CreateArticleDto, author: User, TagList: Tag[]): Promise<Article> {
    const article = new Article(articleDto.title, articleDto.description, articleDto.body, author, TagList)
    return await this.manager.save(Article, article)
  }

  async getArticle(requestingUserId: number, slug: string) {
    return await new SelectArticleQueryBuilder(this.manager)
      .selectMainFields()
      .joinWithAuthor()
      .findIfRequestingUserFollowsArticleAuthor(requestingUserId)
      .findIfArticleIsFavoritedByRequestingUser(requestingUserId)
      .addTagListOfTheArticles()
      .addFavoritesCount()
      .getArticleBySlug(slug)
  }

  async getMostRecentArticles(
    requestingUserId: number,
    articlesQuery: ArticlesQuery
  ): Promise<MixedArticleData[]> {
    return await new SelectArticleQueryBuilder(this.manager)
      .selectMainFields()
      .filterByListOfTags(articlesQuery.tag)
      .joinWithAuthor()
      .filterByAuthor(articlesQuery.author)
      .filterByFavoritedByUser(articlesQuery.favoritedBy)
      .findIfRequestingUserFollowsArticleAuthor(requestingUserId)
      .findIfArticleIsFavoritedByRequestingUser(requestingUserId)
      .addTagListOfTheArticles()
      .addFavoritesCount()
      .getResults(articlesQuery.offset, articlesQuery.limit)
  }

  async getMostRecentArticlesFromWhomUserFollows(
    requestingUserId: number,
    feedArticleQuery: FeedArticlesQuery
  ): Promise<MixedArticleData[]> {
    const listMixedArticleData = await new SelectArticleQueryBuilder(this.manager)
      .selectMainFields()
      .joinWithAuthor()
      .filterByAuthorsThatUserFollows(requestingUserId)
      .findIfArticleIsFavoritedByRequestingUser(requestingUserId)
      .addTagListOfTheArticles()
      .addFavoritesCount()
      .getResults(feedArticleQuery.offset, feedArticleQuery.limit)
    return listMixedArticleData.map((mixedData) => {
      mixedData.following = true
      return mixedData
    })
  }

  async favoriteArticle(userId: number, articleId: number): Promise<void> {
    await this.manager
      .createQueryBuilder()
      .insert()
      .into("FavoritedArticleRelation")
      .values([{ articleId, userId }])
      .orIgnore(`("id") DO NOTHING`)
      .execute()
  }

  async unfavoriteArticle(userId: number, articleId: number) {
    await this.manager.getRepository("FavoritedArticleRelation").delete({ articleId, userId })
  }
}

class SelectArticleQueryBuilder {
  private queryBuilder: SelectQueryBuilder<Article>

  constructor(queryBuilder) {
    this.queryBuilder = queryBuilder.createQueryBuilder().from(Article, "Article")
  }

  selectMainFields(): SelectArticleQueryBuilder {
    this.queryBuilder.select([
      "slug",
      "title",
      "description",
      "body",
      '"updatedAt"',
      '"createdAt"',
      "username",
      "bio",
      '"imageUrl"'
    ])
    return this
  }

  joinWithAuthor(): SelectArticleQueryBuilder {
    this.queryBuilder.innerJoin(User, "Author", "Author.id = Article.authorId")
    return this
  }

  filterByListOfTags(tagList?: string | string[]): SelectArticleQueryBuilder {
    if (isString(tagList)) tagList = [tagList]
    if (tagList) {
      this.queryBuilder
        .innerJoin("ArticleTagRelation", "ATR", "Article.id = ATR.articleId")
        .innerJoin(Tag, "T", "ATR.tagId = T.id")
        .where("T.name = ANY (:tags)", { tags: tagList })
    }
    return this
  }

  filterByAuthor(authorUsername?: string): SelectArticleQueryBuilder {
    if (authorUsername) {
      this.queryBuilder.where("Author.username = :authorUsername", {
        authorUsername
      })
    }
    return this
  }

  filterByAuthorsThatUserFollows(requestingUserId: number): SelectArticleQueryBuilder {
    this.queryBuilder
      .innerJoin(FollowRelation, "FR1", "FR1.userId = Article.authorId")
      .andWhere("FR1.followerId = :requestingUserId", { requestingUserId })
    return this
  }

  filterByFavoritedByUser(username?: string): SelectArticleQueryBuilder {
    if (username) {
      this.queryBuilder
        .innerJoin("FavoritedArticleRelation", "FAR", "FAR.articleId = Article.id")
        .innerJoin(User, "UserF", "UserF.id = FAR.userId")
        .where("UserF.username = :usernameF", { usernameF: username })
    }
    return this
  }

  findIfRequestingUserFollowsArticleAuthor(requestingUserId: number): SelectArticleQueryBuilder {
    this.queryBuilder.addSelect(
      (qb) =>
        qb.select(
          this.existsQuery(
            qb
              .from(FollowRelation, "FR")
              .innerJoin(User, "U", "U.id = FR.followerId")
              .where("FR.userId = Author.id AND U.id = :requestingUserId", {
                requestingUserId
              })
          )
        ),
      "following"
    )
    return this
  }

  findIfArticleIsFavoritedByRequestingUser(requestingUserId: number): SelectArticleQueryBuilder {
    this.queryBuilder.addSelect(
      (qb) =>
        qb.select(
          this.existsQuery(
            qb
              .from("FavoritedArticleRelation", "FAR2")
              .innerJoin(User, "U2", "U2.id = FAR2.userId")
              .where("FAR2.articleId = Article.id AND U2.id = :requestingUserId", { requestingUserId })
          )
        ),
      "favorited"
    )
    return this
  }

  addTagListOfTheArticles(): SelectArticleQueryBuilder {
    this.queryBuilder.addSelect(
      (qb) =>
        qb
          .from(Tag, "T2")
          .select("array_agg(T2.name)")
          .innerJoin("ArticleTagRelation", "ATR2", "ATR2.tagId = T2.id")
          .where("Article.id = ATR2.articleId"),
      "tagList"
    )
    return this
  }

  addFavoritesCount(): SelectArticleQueryBuilder {
    this.queryBuilder.addSelect(
      (qb) =>
        qb
          .select("COUNT(*)", "favoritesCount")
          .from("FavoritedArticleRelation", "FAR")
          .where("FAR.articleId = Article.id"),
      "favoritesCount"
    )
    return this
  }

  async getResults(offset: number, limit: number): Promise<MixedArticleData[]> {
    return await this.queryBuilder
      .groupBy(
        "Article.title, Article.slug, Article.description, Article.body, " +
          "Article.createdAt, Article.updatedAt, " +
          "Author.username, Author.bio, Author.imageUrl"
      )
      .addGroupBy("Article.id, Author.id")
      .orderBy("Article.createdAt", "DESC")
      .offset(offset)
      .limit(limit)
      .getRawMany()
  }

  async getArticleBySlug(slug: string): Promise<MixedArticleData> {
    return await this.queryBuilder.where("Article.slug = :slug", { slug }).getRawOne()
  }

  private existsQuery = <T>(builder: SelectQueryBuilder<T>) => `EXISTS (${builder.getQuery()})`
}
