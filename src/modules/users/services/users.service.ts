import { ConflictException, Injectable } from "@nestjs/common"
import { CreateUserDto } from "../dto/create-user.dto"
import { UpdateUserDto } from "../dto/update-user.dto"
import { TokenService } from "../../auth/services/token.service"
import { FindOption, TokenizedUser } from "../types/users.types"
import { UsersRepository } from "../repositories/users.repository"
import { USER_MESSAGES } from "../../../exceptions/messages.exceptions"
import { User } from "../entities/user.entity"

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository, private tokenService: TokenService) {}

  async registerUser(incomingUser: CreateUserDto): Promise<User> {
    await this.throwIfUserExists(incomingUser)
    return await this.usersRepo.createAndSave(incomingUser)
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
    if (dataFound.email === user.email)
      throw new ConflictException(USER_MESSAGES.EMAIL_ALREADY_EXISTS(user.email))
    if (dataFound.username === user.username)
      throw new ConflictException(USER_MESSAGES.USERNAME_ALREADY_EXISTS(user.username))
  }
}
