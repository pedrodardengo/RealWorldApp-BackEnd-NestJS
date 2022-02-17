import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {User} from "../entities/user.entity"
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUserDto} from "../dto/create-user.dto";
import {UpdateUserDto} from "../dto/update-user.dto";
import {HashService} from "../../auth/services/hash.service";
import {TokenService} from "../../auth/services/token.service";
import {FindOption, TokenizedUser} from "../types/users.types";
import {USER_MESSAGES} from "../exceptions/messages.exceptions";


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        private hashService: HashService,
        private tokenService: TokenService
    ) {}

    async registerUser(incomingUser: CreateUserDto): Promise<TokenizedUser> {
        await this.throwIfUserExists(incomingUser)
        incomingUser.password = await this.hashService.hashPassword(incomingUser.password)
        let user = await this.usersRepo.create(incomingUser)
        user = await this.usersRepo.save(user)
        return await this.tokenService.addTokenToUser(user)
    }

    private async findUser(option: FindOption, throwIfNotFound: boolean): Promise<User> {
        let user = null
        if (option.id) user = await this.usersRepo.findOne(option.id)
        if (option.email && !user) user = await this.usersRepo.findOne({email: option.email})
        if (option.username && !user) user = await this.usersRepo.findOne({username: option.username})
        if (!user && throwIfNotFound) throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND)
        else if (!user) return null
        return user
    }

    async getUserWithToken(option: FindOption, throwIfNotFound = true): Promise<TokenizedUser> {
        const user = await this.findUser(option, throwIfNotFound)
        if (!user) return null
        return this.tokenService.addTokenToUser(user)
    }

    async getUser(option: FindOption, throwIfNotFound = true): Promise<User> {
        return await this.findUser(option, throwIfNotFound)
    }

    async update(id: number, updateUserData: UpdateUserDto): Promise<TokenizedUser> {
        if (updateUserData.password) {
            updateUserData.password = await this.hashService.hashPassword(updateUserData.password)
        }
        let user = await this.getUserWithToken({id})
        user = Object.assign(user, updateUserData)
        return await this.usersRepo.save(user)
    }

    private async throwIfUserExists(user: CreateUserDto): Promise<void> {
        const dataFound = await this.usersRepo.createQueryBuilder()
            .select(['email', 'username'])
            .where(
                "email = :email OR username = :username",
                {email: user.email, username: user.username }
            )
            .getRawOne()
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