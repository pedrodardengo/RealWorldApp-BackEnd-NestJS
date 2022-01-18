import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from "./users/entities/user.entity";
import {Follower} from "./users/entities/follower.entity";

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
                    Follower
                ],
                synchronize: true
            }),
    ],
})
export class AppModule {
}
