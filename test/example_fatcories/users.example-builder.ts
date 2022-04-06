import { Injectable } from "@nestjs/common"
import * as faker from "faker"

@Injectable()
export class UsersExampleBuilder {
  user: any
  login: any
  tokenizedUser: any
  private readonly token: string

  constructor() {
    this.user = {
      id: faker.datatype.number({ min: 1, max: 1000, precision: 1 }),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      bio: faker.lorem.paragraph(1),
      imageUrl: faker.internet.url()
    }
    this.loginExample()
    this.tokenizedUserExample()
    this.token = faker.datatype.string(10)
  }

  // private updateRelated() {
  //     this.loginExample()
  //     this.tokenizedUserExample()
  // }

  private loginExample(): void {
    this.login = {
      email: this.user.email,
      password: this.user.password
    }
  }

  private tokenizedUserExample(): void {
    this.tokenizedUser = Object.assign({ token: this.token }, this.user)
  }

  // numberLessPassword() {
  //     this.user.password = faker.internet.password( ... )
  //     this.updateRelated()
  //     return this
  // }

  // shortPassword() {
  //     this.user.password = faker.internet.password( ... )
  //     this.updateRelated()
  //     return this
  // }

  // symbolLessPassword() {
  //     this.user.password = faker.internet.password( ... )
  //     this.updateRelated()
  //     return this
  // }
}
