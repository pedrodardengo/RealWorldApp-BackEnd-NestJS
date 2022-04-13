import { Injectable, UnauthorizedException } from "@nestjs/common"
import { UsersService } from "../../users/services/users.service"
import { User } from "../../users/entities/user.entity"
import { LoginDto } from "../dto/login.dto"
import { TokenService } from "./token.service"
import { TokenizedUser } from "../../users/types/users.types"
import { compareStringToHash } from "../security/hash-string"
import { AUTH_MESSAGES } from "../../../exceptions/messages.exceptions"
import { CreateUserDto } from "../../users/dto/create-user.dto"
import { PasswordRepository } from "../../users/repositories/password.repository"

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private passRepo: PasswordRepository
  ) {}

  async registerUser(createUserData: CreateUserDto): Promise<TokenizedUser> {
    const password = createUserData.password
    delete createUserData.password
    const user = await this.usersService.registerUser(createUserData)
    await this.registerPassword(user, password)
    return this.tokenService.addTokenToUser(user)
  }

  async login(loginData: LoginDto): Promise<TokenizedUser> {
    const passwordEntity = await this.passRepo.getPasswordFromUserIdOrEmail(loginData.email)
    if (!passwordEntity) throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED_CREDENTIALS)
    const doesPasswordMatch = await compareStringToHash(loginData.password, passwordEntity.password)
    if (!doesPasswordMatch) throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED_CREDENTIALS)
    return await this.usersService.getUserWithToken({ email: loginData.email })
  }

  async updatePassword(requestingUserId: number, oldPassword: string, password: string): Promise<void> {
    let passwordEntity = await this.passRepo.getPasswordFromUserIdOrEmail(requestingUserId)
    passwordEntity = this.passRepo.create(passwordEntity)
    const doesPasswordMatch = await compareStringToHash(oldPassword, passwordEntity.password)
    if (!doesPasswordMatch) throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED_CREDENTIALS)
    passwordEntity.password = password
    await this.passRepo.save(passwordEntity)
  }

  private async registerPassword(user: User, password: string): Promise<void> {
    const passwordEntity = this.passRepo.create({ password, user })
    await this.passRepo.save(passwordEntity)
  }
}
