import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from "../dto/create-user.dto";
import {UpdateUserDto} from "../dto/update-user.dto";
import {TokenService} from "../../auth/services/token.service";
import {FindOption, TokenizedUser} from "../types/users.types";
import {UsersRepository} from "../repositories/users.repository";
import {USER_MESSAGES} from "../../exceptions/messages.exceptions";


@Injectable()
export class UsersService {

    constructor(
        private usersRepo: UsersRepository,
        private tokenService: TokenService
    ) {}

    async registerUser(incomingUser: CreateUserDto): Promise<TokenizedUser> {
        await this.throwIfUserExists(incomingUser)
        const user = await this.usersRepo.createAndSave(incomingUser)
        return await this.tokenService.addTokenToUser(user)
    }

    async getUserWithToken(option: FindOption): Promise<TokenizedUser> {
        const user = await this.usersRepo.findOne(option)
        if (!user) return null
        return this.tokenService.addTokenToUser(user)
    }

    async update(id: number, updateUserData: UpdateUserDto): Promise<TokenizedUser> {
        const user = await this.usersRepo.updateUserReturningIt(id, updateUserData)
        return this.tokenService.addTokenToUser(user)
    }

    private async throwIfUserExists(user: CreateUserDto): Promise<void> {
        const dataFound = await this.usersRepo.findAUserByEmailOrUsername(user.email, user.username)
        if (dataFound === undefined) return
        if (dataFound.email === user.email) throw new BadRequestException(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
        if (dataFound.username === user.username) throw new BadRequestException(USER_MESSAGES.USERNAME_ALREADY_EXISTS)
    }

    // async remove(username: string): Promise<User> {
    //     const user = await this.findByUsername(username)
    //     if (!user) throw new Error('MESSAGES.USER_NOT_FOUND')
    //     return await this.repo.remove(user)
    // }
}