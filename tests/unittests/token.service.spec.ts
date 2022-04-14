import { Test, TestingModule } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { createMock, DeepMocked } from "@golevelup/ts-jest"
import * as _ from "lodash"
import { TokenService } from "../../src/modules/auth/services/token.service"
import { UsersExampleBuilder } from "../example_fatcories/users.example-builder"

describe("TokenServiceTest", () => {
  let tokenService: TokenService
  let jwtServiceMock: DeepMocked<JwtService>
  let userExampleFactory: UsersExampleBuilder

  beforeEach(async () => {
    jest.clearAllMocks()
    jwtServiceMock = createMock<JwtService>()
    userExampleFactory = new UsersExampleBuilder()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: jwtServiceMock
        }
      ]
    }).compile()

    tokenService = module.get<TokenService>(TokenService)
  })

  it("should be defined", () => {
    expect(tokenService).toBeDefined()
  })

  it("should return tokenized user", async () => {
    //Arrange
    const user = userExampleFactory.generateUser().user
    const tokenizedUser = userExampleFactory.generateTokenizedUser().tokenizedUser
    jwtServiceMock.signAsync.mockResolvedValueOnce(tokenizedUser.token)

    //Act
    const expectedTokenizedUser = await tokenService.addTokenToUser(user)

    //Assert
    expect(_.isEqual(expectedTokenizedUser, tokenizedUser)).toBe(true)
  })
})
