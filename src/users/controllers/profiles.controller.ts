import {Controller, Get, Param, Request, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {User} from "../entities/user.entity";
import {dataWrapper} from "../../interceptors/data-wrapper.interceptor";
import {securityWrapper} from "../../interceptors/security.interceptor";
import {ProfileDto} from "../dto/profile.dto";

@Controller('/profiles')
@securityWrapper(ProfileDto)
@dataWrapper('profile')
export class ProfilesController {

    constructor(
        // private usersService: UsersService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('/:username')
    async getProfile(@Request() req, @Param('username') username: string): Promise<User> {
        // const requestsUser = await this.usersService.findUser({id: req.user.id})
        //  find if request's User is following User with "username"
        return
    }
}
