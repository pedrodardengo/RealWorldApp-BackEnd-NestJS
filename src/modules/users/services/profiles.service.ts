import { Injectable } from "@nestjs/common"
import { UsersRepository } from "../repositories/users.repository"
import { UserWithFollowingInfo } from "../types/users.types"

@Injectable()
export class ProfilesService {
  constructor(private usersRepo: UsersRepository) {}

  async getProfile(id: number, profileUsername: string): Promise<UserWithFollowingInfo> {
    const profileUser = await this.usersRepo.findOne({ username: profileUsername })
    const doesUserFollowProfile = await this.usersRepo.doesUserFollowProfile(profileUser.id, id)
    return { ...profileUser, following: doesUserFollowProfile }
  }

  async changeFollowStatus(
    userId: number,
    targetUsername: string,
    toFollow: boolean
  ): Promise<UserWithFollowingInfo> {
    const targetUser = await this.usersRepo.findOne({ username: targetUsername })
    if (toFollow) await this.usersRepo.followUser(targetUser.id, userId)
    else await this.usersRepo.unfollowUser(targetUser.id, userId)
    return { ...targetUser, following: toFollow }
  }
}
