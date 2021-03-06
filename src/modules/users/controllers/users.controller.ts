import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common"
import { UsersService } from "../services/users.service"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { UpdateUserDto } from "../dto/update-user.dto"
import { TokenizedUser } from "../types/users.types"
import { UserDto } from "../dto/user.dto"
import { RequestingUserIdPipe } from "../../../pipes/requesting-user-id.pipe"
import { ResponseMapper } from "../../../interceptors/dto-response-mapper.interceptor"

@Controller("/user")
@ResponseMapper(UserDto)
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getCurrentUser(@RequestingUserIdPipe() id: number): Promise<TokenizedUser> {
    return await this.usersService.getUserWithToken({ id })
  }

  @Put()
  async updateUser(
    @RequestingUserIdPipe() id: number,
    @Body("user") body: UpdateUserDto
  ): Promise<TokenizedUser> {
    return await this.usersService.update(id, body)
  }
}
