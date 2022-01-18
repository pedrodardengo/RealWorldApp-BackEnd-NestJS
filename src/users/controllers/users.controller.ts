import {Controller, Get, UseGuards, Request, Body, Put} from '@nestjs/common';
import {UsersService} from "../services/users.service";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {UpdateUserDto} from "../dto/update-user.dto";
import {dataWrapper} from "../../interceptors/data-wrapper.interceptor";
import {TokenizedUser} from "../types/users.types";
import {securityWrapper} from "../../interceptors/security.interceptor";
import {UserDto} from "../dto/user.dto";


@Controller('/user')
@securityWrapper(UserDto)
@dataWrapper('user')
export class UsersController {

    constructor(
        private usersService: UsersService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getCurrentUser(@Request() req): Promise<TokenizedUser> {
        return await this.usersService.findUser({id: req.user.id})
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async updateUser(@Request() req, @Body('user') body: UpdateUserDto): Promise<TokenizedUser> {
        return await this.usersService.update(req.user.id, body)
    }
}
