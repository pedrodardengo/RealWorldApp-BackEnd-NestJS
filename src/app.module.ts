import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from "./users/entities/user.entity";
import {FollowRelation} from "./users/entities/follow-relation.entity";
import { ArticlesModule } from './articles/articles.module';

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
                    FollowRelation
                ],
                synchronize: true
            }),
        ArticlesModule,
    ],
})
export class AppModule {
}
