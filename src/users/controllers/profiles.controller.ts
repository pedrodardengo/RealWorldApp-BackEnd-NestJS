import {Controller, Delete, Get, Param, Post, Request, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {dataWrapper} from "../../interceptors/data-wrapper.interceptor";
import {securityWrapper} from "../../interceptors/security.interceptor";
import {ProfileDto} from "../dto/profile.dto";
import {ProfileService} from "../services/profile.service";

@Controller('/profiles')
@securityWrapper(ProfileDto)
@dataWrapper('profile')
@UseGuards(JwtAuthGuard)
export class ProfilesController {

    constructor(
        private profileService: ProfileService
    ) {}

    @Get('/:username')
    async getProfile(@Request() req, @Param('username') username: string): Promise<ProfileDto> {
        return await this.profileService.getProfile(req.user.id, username)
    }

    @Post('/:username/follow')
    async followUser(@Request() req, @Param('username') username: string): Promise<ProfileDto> {
        return await this.profileService.followUser(req.user.id, username)
    }

    @Delete('/:username/follow')
    async unfollowUSer(@Request() req, @Param('username') username: string): Promise<ProfileDto> {
        return await this.profileService.unfollowUser(req.user.id, username)
    }
}
