import {Controller, Delete, Get, Param, Post, UseGuards} from "@nestjs/common";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {dataWrapper} from "../../interceptors/data-wrapper.interceptor";
import {securityWrapper} from "../../interceptors/security.interceptor";
import {ProfileDto} from "../dto/profile.dto";
import {ProfilesService} from "../services/profiles.service";
import {RequestingUserIdPipe} from "../../pipes/requesting-user-id.pipe";

@Controller('/profiles')
@securityWrapper(ProfileDto)
@dataWrapper('profile')
@UseGuards(JwtAuthGuard)
export class ProfilesController {

    constructor(
        private profileService: ProfilesService
    ) {}

    @Get('/:username')
    async getProfile(
        @RequestingUserIdPipe() id: number,
        @Param('username') username: string
    ): Promise<ProfileDto> {
        return await this.profileService.getProfile(id, username)
    }

    @Post('/:username/follow')
    async followUser(
        @RequestingUserIdPipe() id: number,
        @Param('username') username: string
    ): Promise<ProfileDto> {
        return await this.profileService.followUser(id, username)
    }

    @Delete('/:username/follow')
    async unfollowUSer(
        @RequestingUserIdPipe() id: number,
        @Param('username') username: string
    ): Promise<ProfileDto> {
        return await this.profileService.unfollowUser(id, username)
    }
}
