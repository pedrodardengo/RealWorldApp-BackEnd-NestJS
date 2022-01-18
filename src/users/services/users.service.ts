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
        @InjectRepository(User) private repo: Repository<User>,
        private hashService: HashService,
        private tokenService: TokenService
    ) {}

    async registerUser(incomingUser: CreateUserDto): Promise<TokenizedUser> {
        await this.throwIfUserExists(incomingUser)
        incomingUser.password = await this.hashService.hashPassword(incomingUser.password)
        let user = await this.repo.create(incomingUser)
        user = await this.repo.save(user)
        return await this.tokenService.addTokenToUser(user)
    }

    async findUser(option: FindOption, throwIfNotFound: boolean = true): Promise<TokenizedUser> {
        let user = null
        if (option.id) user = await this.repo.findOne(option.id)
        if (option.email && !user) user = await this.repo.findOne({email: option.email})
        if (option.username && !user) user = await this.repo.findOne({username: option.username})
        if (!user && throwIfNotFound) throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND)
        if (!user) return null
        return this.tokenService.addTokenToUser(user)
    }

    async update(id: number, updateUserData: UpdateUserDto): Promise<TokenizedUser> {
        if (updateUserData.password) {
            updateUserData.password = await this.hashService.hashPassword(updateUserData.password)
        }
        let user = await this.findUser({id})
        user = Object.assign(user, updateUserData)
        return await this.repo.save(user)
    }

    private async throwIfUserExists(user: CreateUserDto): Promise<void> {
        const [foundUserByEmail, foundUserByUsername] = await Promise.all([
            this.repo.findOne({email: user.email}),
            this.repo.findOne({username: user.username})
        ])
        if (foundUserByEmail) throw new BadRequestException(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
        if (foundUserByUsername) throw new BadRequestException(USER_MESSAGES.USERNAME_ALREADY_EXISTS)
    }

    // async remove(username: string): Promise<User> {
    //     const user = await this.findByUsername(username)
    //     if (!user) throw new Error('MESSAGES.USER_NOT_FOUND')
    //     return await this.repo.remove(user)
    // }
}