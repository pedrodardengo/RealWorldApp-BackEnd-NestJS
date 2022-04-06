import { CreateArticleDto } from "./create-article.dto";
import { PickType } from "@nestjs/swagger";

export class UpdateArticleDto extends PickType(CreateArticleDto, [
  "title",
  "description",
  "body",
] as const) {}
