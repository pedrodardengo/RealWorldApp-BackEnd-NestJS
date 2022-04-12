import { UsersService } from "../../src/users/services/users.service"
import { createMock, DeepMocked } from "@golevelup/ts-jest"
import { User } from "../../src/users/entities/user.entity"
import { TokenService } from "../../src/auth/services/token.service"
import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { UsersRepository } from "../../src/users/repositories/users.repository"

describe("UsersService", () => {
  let usersService: UsersService
  let repoMock: DeepMocked<UsersRepository>
  let tokenServiceMock: DeepMocked<TokenService>

  beforeEach(async () => {
    jest.clearAllMocks()
    repoMock = createMock<UsersRepository>()
    tokenServiceMock = createMock<TokenService>()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
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
  //
  // it('should throw if trying to register a user with an already existing email', async () => {
  //     //Arrange
  //     repoMock.findOne.mockImplementation((object) => {
  //         if (object.email) return userExample.user
  //         else return null
  //     })
  //
  //     //Act
  //     const tryRegister = usersService.registerUser(userExample.user)
  //
  //     //Assert
  //     await expect(async () => {await tryRegister}).rejects.toThrow(
  //         USER_MESSAGES.EMAIL_ALREADY_EXISTS(userExample.user.email)
  //     )
  // });
  //
  // it('should throw if trying to register a user with an already existing username', async () => {
  //     //Arrange
  //     repoMock.findOne.mockImplementation((object) => {
  //         if (object.username) return userExample.user
  //         else return null
  //     })
  //
  //     //Act
  //     const tryRegister = usersService.registerUser(userExample.user)
  //
  //     //Assert
  //     await expect(async () => {await tryRegister}).rejects.toThrow(USER_MESSAGES.USERNAME_ALREADY_EXISTS)
  //
  // it('should register the user and return it with a token when user is valid', async () => {
  //     //Arrange
  //     const incomingUser = userExample.user
  //     userExample.user.password = 'aHash'
  //     userExample.tokenizedUser.password = 'aHash'
  //     repoMock.findOne.mockReturnValue(null)
  //     hashServiceMock.hashPassword.mockResolvedValueOnce('aHash')
  //     repoMock.create.mockImplementation((user: any) => user)
  //     repoMock.save.mockImplementation((user: any) => user)
  //     tokenServiceMock.addTokenToUser.mockImplementation(
  //         (user: any) => Object.assign({token: userExample.tokenizedUser.token}, user)
  //     )
  //
  //     //Act
  //     const tryRegister = usersService.registerUser(incomingUser)
  //
  //     //Assert
  //     expect(_.isEqual(userExample.tokenizedUser, await tryRegister)).toBe(true)
  //
  // });
  //
  // it.each([
  //     'id', 'email', 'username'
  // ])(
  //     `should find a user by ID, email or username if findOption is provided and return user with token`,
  //     async (findBy) => {
  //         const findOption = {[findBy]: userExample.user[findBy]}
  //         repoMock.findOne.mockReturnValue(userExample.user)
  //         tokenServiceMock.addTokenToUser.mockImplementation(
  //             (user: any) => Object.assign({token: userExample.tokenizedUser.token}, user)
  //         )
  //
  //         //Act
  //         const tryFinding = usersService.getUser(findOption)
  //
  //         //Assert
  //         expect(_.isEqual(userExample.tokenizedUser, await tryFinding)).toBe(true)
  //     }
  // );
  //
  // it.each([true, false])(
  //     'should (not) throw error when trying to find a user that does not exists and (un)allowed to throw',
  //     async (shouldThrow) => {
  //         repoMock.findOne.mockReturnValue(null)
  //         const findOption = {id: userExample.user.id, email: userExample.user.email, username: userExample.user.username}
  //
  //         //Act
  //         const tryFinding = usersService.getUser(findOption, shouldThrow)
  //
  //         //Assert
  //         if (shouldThrow) await expect(async () => {await tryFinding}).rejects.toThrow(USER_MESSAGES.USER_NOT_FOUND)
  //         else expect(await tryFinding).toBeNull()
  //     }
  // );
  //
  // it('should update user', async () => {
  //     //Arrange
  //     const updateData = Object.assign({}, userExample.user)
  //
  //     const userExample2 = new UsersExampleBuilder()
  //     userExample2.user.id = updateData.id
  //     const userFromDb = Object.assign({}, userExample2.user)
  //
  //     const returnedUser = userExample.tokenizedUser
  //     returnedUser.password = 'aHash'
  //
  //     repoMock.findOne.mockReturnValue(userFromDb)
  //     hashServiceMock.hashPassword.mockResolvedValueOnce('aHash')
  //     repoMock.save.mockImplementation((user: any) => user)
  //     tokenServiceMock.addTokenToUser.mockImplementation(
  //         (user: any) => Object.assign({token: returnedUser.token}, user)
  //     )
  //
  //     //Act
  //     const tryUpdating = await usersService.update(updateData.id, updateData)
  //
  //     //Assert
  //     expect(_.isEqual(userExample.tokenizedUser, await tryUpdating)).toBe(true)
  // });
})