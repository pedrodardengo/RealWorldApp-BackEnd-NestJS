import { Body, Controller, Post } from "@nestjs/common"
import { AuthService } from "../services/auth.service"
import { LoginDto } from "../dto/login.dto"
import { CreateUserDto } from "../../users/dto/create-user.dto"
import { UsersService } from "../../users/services/users.service"
import { UserDto } from "../../users/dto/user.dto"
import { TokenizedUser } from "../../users/types/users.types"
import { ResponseMapper } from "../../../interceptors/dto-response-mapper.interceptor"

@Controller("/users")
@ResponseMapper(UserDto)
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post("/login")
  async login(@Body("user") loginData: LoginDto): Promise<TokenizedUser> {
    return await this.authService.login(loginData)
  }

  @Post()
  async registerUser(@Body("user") createUserData: CreateUserDto): Promise<TokenizedUser> {
    return await this.usersService.registerUser(createUserData)
  }
}
