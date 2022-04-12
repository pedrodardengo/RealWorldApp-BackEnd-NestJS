import { IsInt, Max, Min } from "class-validator"

export class FeedArticlesQuery {
  @Max(100)
  @Min(0)
  @IsInt()
  limit?: number = 20

  @Min(0)
  @IsInt()
  offset?: number = 0
}
