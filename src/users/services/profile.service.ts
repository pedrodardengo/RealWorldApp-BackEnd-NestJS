import {Injectable} from "@nestjs/common";
import {ProfileDto} from "../dto/profile.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {FollowRelation} from "../entities/follow-relation.entity";
import {User} from "../entities/user.entity";
import {UsersService} from "./users.service";


@Injectable()
export class ProfileService {

    constructor(
        @InjectRepository(FollowRelation) private followRelationRepo: Repository<FollowRelation>,
        @InjectRepository(User) private userRepo: Repository<User>,
        private usersService: UsersService
    ) {}

    async getProfile(id: number, profileUsername: string): Promise<ProfileDto> {
        const follower = await this.userRepo.createQueryBuilder("U")
            .innerJoinAndSelect(
                FollowRelation, "F", "U.id = F.userId AND U.username = :username",
                {username: profileUsername}
            )
            .innerJoinAndSelect(
                User, "U2", "U2.id = F.followerId AND U2.id = :id", {id}
            )
            .getOne()
        if (follower) return new ProfileDto(follower, true)
        else {
            const user = await this.usersService.getUser({username: profileUsername})
            return new ProfileDto(user, false)
        }
    }

    async followUser(userId: number, targetUsername: string): Promise<ProfileDto> {
        const [user, targetUser] = await this.getUserAndFollower(userId, targetUsername)
        await this.followRelationRepo.save(new FollowRelation(targetUser, user))
        return new ProfileDto(targetUser, true)
    }

    async unfollowUser(id: number, targetUsername: string): Promise<ProfileDto> {
        const [user, targetUser] = await this.getUserAndFollower(id, targetUsername)
        await this.followRelationRepo.delete(new FollowRelation(targetUser, user))
        return new ProfileDto(targetUser, false)
    }

    private async getUserAndFollower(id: number, profileUsername: string): Promise<User[]> {
        const users = await this.userRepo.createQueryBuilder("user")
            .where("user.id = :id OR user.username = :profileUsername", { id, profileUsername })
            .getMany()
        const [user, targetUser] = users[0].id === id ? users : users.reverse()
        return [user, targetUser]
    }
}
