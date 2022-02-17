import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from "../../users/services/users.service";
import {User} from "../../users/entities/user.entity";
import {LoginDto} from "../dto/login.dto";
import {HashService} from "./hash.service";
import {TokenService} from "./token.service";
import {TokenizedUser} from "../../users/types/users.types";
import {AUTH_MESSAGES} from "../exceptions/messages.exceptions";


@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private hashHandler: HashService,
        private tokenService: TokenService
    ) {}

    async login(loginData: LoginDto): Promise<TokenizedUser> {
        let user = await this.authenticateUser(loginData.email, loginData.password)
        return this.tokenService.addTokenToUser(user)
    }

    private async authenticateUser(email: string, password: string): Promise<Partial<User>> {
        const user = await this.usersService.getUserWithToken({email}, false)
        if (!user) throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED)
        const doesPasswordMatch = await this.hashHandler.comparePasswordToHash(password, user.password)
        if (!doesPasswordMatch) throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED)
        return user
    }
}