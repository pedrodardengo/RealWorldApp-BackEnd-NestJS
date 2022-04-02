import {forwardRef, Module} from '@nestjs/common';
import {AuthService} from './services/auth.service';
import {UsersModule} from "../users/users.module";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {AuthController} from "./controllers/auth.controller";
import {JwtStrategy} from "./security/jwt.strategy";
import {TokenService} from "./services/token.service";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        PassportModule,
        JwtModule.register({
            secret: 'aSecretKey',
            signOptions: {expiresIn: '2h'},
        })
    ],
    providers: [
        AuthService,
        JwtStrategy,
        TokenService
    ],
    exports: [
        TokenService
    ],
    controllers: [AuthController]
})
export class AuthModule {
}