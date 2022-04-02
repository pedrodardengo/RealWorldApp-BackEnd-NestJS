import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from "./users/entities/user.entity";
import {FollowRelation} from "./users/entities/follow-relation.entity";
import { ArticlesModule } from './articles/articles.module';
import {Article} from "./articles/entities/article.entity";
import {Comment} from "./articles/entities/comment.entity";
import {Tag} from "./articles/entities/tag.entity";

@Module({
    imports: [
        UsersModule,
        AuthModule,
        TypeOrmModule.forRoot(
            {
                type: 'sqlite',
                database: 'db.realWorldApp',
                entities: [
                    User,
                    FollowRelation,
                    Article,
                    Comment,
                    Tag
                ],
                synchronize: true
            }),
        ArticlesModule,
    ],
})
export class AppModule {
}
