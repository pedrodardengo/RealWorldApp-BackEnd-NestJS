import {Module} from '@nestjs/common';
import {UsersService} from './services/users.service';
import {UsersController} from './controllers/users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {AuthModule} from "../auth/auth.module";
import {ProfilesController} from "./controllers/profiles.controller";

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([User])
    ],
    providers: [
        UsersService
    ],
    exports: [
        UsersService
    ],
    controllers: [
        UsersController,
        ProfilesController
    ]
})
export class UsersModule {
}
