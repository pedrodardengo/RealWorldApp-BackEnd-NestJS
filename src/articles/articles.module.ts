import { CacheModule, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Comment } from "./entities/comment.entity"
import { Tag } from "./entities/tag.entity"
import { ArticlesService } from "./services/articles.service"
import { CommentsService } from "./services/comments.service"
import { TagsService } from "./services/tags.service"
import { ArticlesController } from "./controllers/articles.controller"
import { CommentsController } from "./controllers/comments.controller"
import { TagsController } from "./controllers/tags.controller"
import { UsersRepository } from "../users/repositories/users.repository"
import { ArticlesRepository } from "./repositories/articles.repository"

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersRepository,
      ArticlesRepository,
      Comment,
      Tag
    ]),
    CacheModule.register()
  ],
  providers: [ArticlesService, CommentsService, TagsService],
  controllers: [ArticlesController, CommentsController, TagsController]
})
export class ArticlesModule {}
