import { Module } from "@nestjs/common"
import { UsersModule } from "./modules/users/users.module"
import { AuthModule } from "./modules/auth/auth.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./modules/users/entities/user.entity"
import { FollowRelation } from "./modules/users/entities/follow-relation.entity"
import { ArticlesModule } from "./modules/articles/articles.module"
import { Article } from "./modules/articles/entities/article.entity"
import { Comment } from "./modules/articles/entities/comment.entity"
import { Tag } from "./modules/articles/entities/tag.entity"
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: "postgres",
          host: config.get("DB_HOST"),
          port: config.get("DB_PORT"),
          username: config.get("DB_USERNAME"),
          password: config.get("DB_PASSWORD"),
          database: config.get("DB_USERNAME"),
          entities: [User, FollowRelation, Article, Comment, Tag],
          synchronize: true
        }
      }
    }),

    UsersModule,
    AuthModule,
    ArticlesModule
  ]
})
export class AppModule {}
