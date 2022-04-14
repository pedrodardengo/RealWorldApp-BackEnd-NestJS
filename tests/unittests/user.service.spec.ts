import { UsersService } from "../../src/modules/users/services/users.service"
import { createMock, DeepMocked } from "@golevelup/ts-jest"
import { TokenService } from "../../src/modules/auth/services/token.service"
import { Test, TestingModule } from "@nestjs/testing"
import { UsersRepository } from "../../src/modules/users/repositories/users.repository"
import { UsersExampleBuilder } from "../example_fatcories/users.example-builder"
import { USER_MESSAGES } from "../../src/exceptions/messages.exceptions"
import { User } from "../../src/modules/users/entities/user.entity"
import * as _ from "lodash"

describe("UsersService", () => {
  let usersService: UsersService
  let repoMock: DeepMocked<UsersRepository>
  let tokenServiceMock: DeepMocked<TokenService>
  let userExample: UsersExampleBuilder

  beforeEach(async () => {
    jest.clearAllMocks()
    repoMock = createMock<UsersRepository>()
    tokenServiceMock = createMock<TokenService>()
    userExample = new UsersExampleBuilder()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: repoMock
        },
        {
          provide: TokenService,
          useValue: tokenServiceMock
        }
      ]
    }).compile()

    usersService = module.get<UsersService>(UsersService)
  })

  it("should be defined", () => {
    expect(usersService).toBeDefined()
  })

  it("registerUser should throw if trying to register a user with an already existing email", async () => {
    //Arrange
    const storedUser = userExample.generateUser().user
    const incomingUser = userExample.generateUser().user
    incomingUser.email = storedUser.email
    repoMock.findAUserByEmailOrUsername.mockImplementation(async (email, username) => {
      if (email === storedUser.email) return storedUser
    })

    //Act
    const tryRegister = usersService.registerUser(incomingUser)

    //Assert
    await expect(async () => {
      await tryRegister
    }).rejects.toThrow(USER_MESSAGES.EMAIL_ALREADY_EXISTS(incomingUser.email))
  })

  it("registerUser should throw if trying to register a user with an already existing username", async () => {
    //Arrange
    const storedUser = userExample.generateUser().user
    const incomingUser = userExample.generateUser().user
    incomingUser.username = storedUser.username
    repoMock.findAUserByEmailOrUsername.mockImplementation(async (email, username) => {
      if (username === storedUser.username) return storedUser
    })

    //Act
    const tryRegister = usersService.registerUser(incomingUser)

    //Assert
    await expect(async () => {
      await tryRegister
    }).rejects.toThrow(USER_MESSAGES.USERNAME_ALREADY_EXISTS(incomingUser.username))
  })

  it("registerUser should register the user and return it", async () => {
    //Arrange
    const incomingUser = userExample.generateUser().user
    repoMock.createAndSave.mockImplementation(async (object) => {
      const user = new User()
      user.email = object.email
      user.username = object.username
      user.imageUrl = object.imageUrl
      user.bio = object.bio
      return user
    })

    //Act
    const tryRegister = usersService.registerUser(incomingUser)

    //Assert
    expect(_.isEqual(userExample.user, await tryRegister)).toBe(true)
  })

  it("should update and return updated user", async () => {
    //Arrange
    const incomingUser = userExample.generateUser().user
    const tokenizedUser = userExample.generateTokenizedUser().tokenizedUser
    repoMock.save.mockImplementation(async () => incomingUser)
    tokenServiceMock.addTokenToUser.mockImplementation(async () => tokenizedUser)

    //Act
    const tryUpdating = await usersService.update(incomingUser.id, incomingUser)

    //Assert
    expect(_.isEqual(userExample.tokenizedUser, await tryUpdating)).toBe(true)
  })
})
