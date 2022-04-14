import { Injectable } from "@nestjs/common"
import * as faker from "faker"
import { LoginDto } from "../../src/modules/auth/dto/login.dto"
import { User } from "../../src/modules/users/entities/user.entity"
import { TokenizedUser } from "../../src/modules/users/types/users.types"

@Injectable()
export class UsersExampleBuilder {
  user: User
  login: LoginDto
  tokenizedUser: TokenizedUser

  generateUser(): UsersExampleBuilder {
    this.user = new User()
    this.user.username = faker.internet.userName()
    this.user.email = faker.internet.email()
    this.user.bio = faker.lorem.paragraph()
    this.user.imageUrl = faker.internet.url()
    return this
  }

  generateLoginDto(): UsersExampleBuilder {
    this.login = {
      email: this.user.email,
      password: faker.internet.password()
    }
    return this
  }

  generateTokenizedUser() {
    this.tokenizedUser = { token: faker.datatype.string(10), ...this.user }
    return this
  }
}
