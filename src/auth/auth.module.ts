import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import {UsersModule} from "../users/users.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./controllers/auth.controller";
import {JwtStrategy} from "./security/jwt.strategy";
import {HashService} from "./services/hash.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../users/entities/user.entity";
import {TokenService} from "./services/token.service";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        PassportModule,
        JwtModule.register({
            secret: 'aSecretKey',
            signOptions: {expiresIn: '2h'},
        }),
        TypeOrmModule.forFeature([User])
    ],
    providers: [
        AuthService,
        JwtStrategy,
        HashService,
        TokenService
    ],
    exports: [
        HashService,
        TokenService
    ],
    controllers: [AuthController]
})
export class AuthModule {
}