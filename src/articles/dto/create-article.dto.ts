import { IsString, MaxLength } from "class-validator"

export class CreateArticleDto {
  @IsString()
  @MaxLength(80)
  title: string

  @IsString()
  @MaxLength(500)
  description: string

  @IsString()
  body: string

  tagList?: string[]
}
