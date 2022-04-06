import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/entities/user.entity";
import { FollowRelation } from "./users/entities/follow-relation.entity";
import { ArticlesModule } from "./articles/articles.module";
import { Article } from "./articles/entities/article.entity";
import { Comment } from "./articles/entities/comment.entity";
import { Tag } from "./articles/entities/tag.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
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
          synchronize: true,
        };
      },
    }),

    UsersModule,
    AuthModule,
    ArticlesModule,
  ],
})
export class AppModule {}
