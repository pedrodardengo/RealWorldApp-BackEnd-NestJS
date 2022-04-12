import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard"
import { ProfileDto } from "../dto/profile.dto"
import { ProfilesService } from "../services/profiles.service"
import { RequestingUserIdPipe } from "../../../pipes/requesting-user-id.pipe"
import { UserWithFollowingInfo } from "../types/users.types"
import { ResponseMapper } from "../../../interceptors/dto-response-mapper.interceptor"

@Controller("/profiles")
@ResponseMapper(ProfileDto)
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @Get("/:username")
  async getProfile(
    @RequestingUserIdPipe() id: number,
    @Param("username") username: string
  ): Promise<UserWithFollowingInfo> {
    return await this.profileService.getProfile(id, username)
  }

  @Post("/:username/follow")
  async followUser(
    @RequestingUserIdPipe() id: number,
    @Param("username") username: string
  ): Promise<UserWithFollowingInfo> {
    return await this.profileService.changeFollowStatus(id, username, true)
  }

  @Delete("/:username/follow")
  async unfollowUSer(
    @RequestingUserIdPipe() id: number,
    @Param("username") username: string
  ): Promise<UserWithFollowingInfo> {
    return await this.profileService.changeFollowStatus(id, username, false)
  }
}
