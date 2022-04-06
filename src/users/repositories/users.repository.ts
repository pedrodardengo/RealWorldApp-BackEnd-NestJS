import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { FollowRelation } from "../entities/follow-relation.entity";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createAndSave(incomingUser: CreateUserDto): Promise<User> {
    const user = new User().build(incomingUser);
    return await this.manager.save(user);
  }

  async updateUserReturningIt(
    id: number,
    updateUserData: UpdateUserDto
  ): Promise<User> {
    return await this.manager
      .getRepository(User)
      .save({ id, ...updateUserData });
  }

  async findAUserByEmailOrUsername(
    email: string,
    username: string
  ): Promise<User> {
    return await this.manager.findOne(User, {
      where: [{ username }, { email }],
    });
  }

  async doesUserFollowProfile(user: number, follower: number) {
    return Boolean(
      await this.manager.findOne(FollowRelation, { where: { user, follower } })
    );
  }

  async followUser(userId: number, profileUserId: number): Promise<void> {
    await this.manager
      .createQueryBuilder()
      .insert()
      .into("FollowRelation")
      .values({ user: userId, follower: profileUserId })
      .execute();
  }

  async unfollowUser(userId: number, followerId: number): Promise<void> {
    await this.manager
      .createQueryBuilder()
      .delete()
      .from(FollowRelation)
      .where("userId = :userId AND followerId = :followerId", {
        userId,
        followerId,
      })
      .execute();
  }
}
