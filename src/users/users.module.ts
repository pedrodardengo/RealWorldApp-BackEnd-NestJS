import {Module} from '@nestjs/common';
import {UsersService} from './services/users.service';
import {UsersController} from './controllers/users.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AuthModule} from "../auth/auth.module";
import {ProfilesController} from "./controllers/profiles.controller";
import {ProfilesService} from "./services/profiles.service";
import {UsersRepository} from "./repositories/users.repository";

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([UsersRepository])
    ],
    providers: [
        UsersService,
        ProfilesService
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
