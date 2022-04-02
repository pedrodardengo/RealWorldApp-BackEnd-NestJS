import {Repository, EntityRepository} from "typeorm";
import {User} from "../entities/user.entity";
import {CreateUserDto} from "../dto/create-user.dto";
import {UpdateUserDto} from "../dto/update-user.dto";
import {FollowRelation} from "../entities/follow-relation.entity";


@EntityRepository(User)
export class UsersRepository extends Repository<User> {

    async createAndSave(incomingUser: CreateUserDto): Promise<User> {
        const user = new User().build(incomingUser)
        return await this.manager.save(user)
    }

    async updateUserReturningIt(id: number, updateUserData: UpdateUserDto): Promise<User> {
        return await this.manager.update(User,{id}, updateUserData).then(response => response.raw[0])
    }

    async findAUserByEmailOrUsername(email: string, username: string): Promise<User> {
        return await this.manager.findOne(User,{where: [{username}, {email}]})
    }

    async doesUserFollowProfile(userId: number, followerId: number) {
        return Boolean(await this.manager.findOne(FollowRelation, {where: {userId, followerId}}))
    }

    async followUser(userId: number, profileUserId: number): Promise<void> {
        await this.manager.createQueryBuilder()
            .insert()
            .into('FollowRelation')
            .values({ user: userId, follower: profileUserId })
            .execute()
    }

    async unfollowUser(userId: number, followerId: number): Promise<void> {
        await this.manager.createQueryBuilder()
            .delete()
            .from(FollowRelation)
            .where("userId = :userId AND followerId = :followerId", {userId, followerId})
            .execute()
    }
}