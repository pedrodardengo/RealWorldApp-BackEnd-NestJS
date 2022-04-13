import { Body, Controller, Post, Put, UseGuards } from "@nestjs/common"
import { AuthService } from "../services/auth.service"
import { LoginDto } from "../dto/login.dto"
import { CreateUserDto } from "../../users/dto/create-user.dto"
import { UserDto } from "../../users/dto/user.dto"
import { TokenizedUser } from "../../users/types/users.types"
import { ResponseMapper } from "../../../interceptors/dto-response-mapper.interceptor"
import { JwtAuthGuard } from "../guards/jwt-auth.guard"
import { RequestingUserIdPipe } from "../../../pipes/requesting-user-id.pipe"
import { UpdatePasswordDto } from "../dto/update-password.dto"

@Controller("/users")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ResponseMapper(UserDto)
  @Post("/login")
  async login(@Body("user") loginData: LoginDto): Promise<TokenizedUser> {
    return await this.authService.login(loginData)
  }

  @ResponseMapper(UserDto)
  @Post()
  async registerUser(@Body("user") createUserData: CreateUserDto): Promise<TokenizedUser> {
    return await this.authService.registerUser(createUserData)
  }

  @UseGuards(JwtAuthGuard)
  @Put("/password")
  async changePassword(
    @RequestingUserIdPipe() id: number,
    @Body("passwords") updatePasswordDto: UpdatePasswordDto
  ): Promise<void> {
    await this.authService.updatePassword(id, updatePasswordDto.oldPassword, updatePasswordDto.password)
  }
}
