import { Injectable } from "@nestjs/common";
import { ProfileDto } from "../dto/profile.dto";
import { User } from "../entities/user.entity";
import { isString } from "class-validator";
import { UsersRepository } from "../repositories/users.repository";

@Injectable()
export class ProfilesService {
  constructor(private usersRepo: UsersRepository) {}

  async getProfile(id: number, profileUser: User): Promise<ProfileDto>;
  async getProfile(id: number, profileUsername: string): Promise<ProfileDto>;
  async getProfile(
    id: number,
    profileUserOrUsername: string | User
  ): Promise<ProfileDto> {
    if (isString(profileUserOrUsername)) {
      profileUserOrUsername = await this.usersRepo.findOne({
        username: profileUserOrUsername,
      });
    }
    const doesUserFollowProfile = await this.usersRepo.doesUserFollowProfile(
      profileUserOrUsername.id,
      id
    );
    return new ProfileDto().mapFromUser(
      profileUserOrUsername,
      doesUserFollowProfile
    );
  }

  async followUser(
    userId: number,
    targetUsername: string
  ): Promise<ProfileDto> {
    const targetUser = await this.usersRepo.findOne({
      username: targetUsername,
    });
    await this.usersRepo.followUser(targetUser.id, userId);
    return new ProfileDto().mapFromUser(targetUser, true);
  }

  async unfollowUser(id: number, targetUsername: string): Promise<ProfileDto> {
    const targetUser = await this.usersRepo.findOne({
      username: targetUsername,
    });
    await this.usersRepo.unfollowUser(targetUser.id, id);
    return new ProfileDto().mapFromUser(targetUser, false);
  }
}
