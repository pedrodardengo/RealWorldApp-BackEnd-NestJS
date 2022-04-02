import {Test} from '@nestjs/testing';
import {AuthService} from '../services/auth.service';
import {createMock, DeepMocked} from "@golevelup/ts-jest";
import {UsersService} from "../../users/services/users.service";
import {HashService} from "../security/hash-password";
import {TokenService} from "../services/token.service";
import {AUTH_MESSAGES} from "../exceptions/messages.exceptions";
import {UsersExampleBuilder} from "../../../test/example_fatcories/users.example-builder";


describe('AuthService', () => {
    let authService: AuthService
    let usersServiceMock: DeepMocked<UsersService>
    let hashServiceMock: DeepMocked<HashService>
    let tokenServiceMock: DeepMocked<TokenService>
    let userExampleFactory: UsersExampleBuilder

    beforeEach(async () => {
        jest.clearAllMocks()
        usersServiceMock = createMock<UsersService>()
        hashServiceMock = createMock<HashService>()
        tokenServiceMock = createMock<TokenService>()
        userExampleFactory = new UsersExampleBuilder()

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: usersServiceMock,
                },
                {
                    provide: HashService,
                    useValue: hashServiceMock
                },
                {
                    provide: TokenService,
                    useValue: tokenServiceMock
                }
            ]
        }).compile()
        authService = module.get(AuthService)

    })

    it('should be defined', () => {
        expect(authService).toBeDefined()
    })

    it('should throw if when trying to log in the email is not found', async () => {
        //Arrange
        const loginData = userExampleFactory.login
        usersServiceMock.findUser.mockResolvedValueOnce(null)

        //Act
        const tryToLogIn = authService.login(loginData)

        //Assert
        await expect(async () => {await tryToLogIn}).rejects.toThrow(AUTH_MESSAGES.UNAUTHORIZED)

    })

    it('should throw if trying to log in and password does not match', async () => {
        //Arrange
        const loginData = userExampleFactory.login
        hashServiceMock.comparePasswordToHash.mockResolvedValueOnce(false)

        //Act
        const tryToLogIn = authService.login(loginData)

        //Assert
        await expect(async () => {await tryToLogIn}).rejects.toThrow(AUTH_MESSAGES.UNAUTHORIZED)

    })

    it('should return tokenized user if is authorized', async () => {
        //Arrange
        const loginData = userExampleFactory.login
        const tokenizedUser = userExampleFactory.tokenizedUser
        usersServiceMock.findUser.mockResolvedValueOnce(tokenizedUser)
        hashServiceMock.comparePasswordToHash.mockResolvedValueOnce(true)
        tokenServiceMock.addTokenToUser.mockResolvedValueOnce(tokenizedUser)

        //Act
        const tryToLogIn = authService.login(loginData)

        //Assert
        expect(await tryToLogIn).toBe(tokenizedUser)
    })
})