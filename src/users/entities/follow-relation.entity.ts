import {Entity, ManyToOne, PrimaryColumn,} from "typeorm";
import {User} from "./user.entity";


@Entity()
export class FollowRelation {

    @PrimaryColumn({type: 'int', name: 'userId'})
    @ManyToOne(() => User, (user) => user.id, {
        onDelete: 'CASCADE'
    })
    user: User

    @PrimaryColumn({type: 'int', name: 'followerId'})
    @ManyToOne(() => User, (user) => user.id, {
        onDelete: 'CASCADE'
    })
    follower: User

    constructor(targetUser: User, follower: User) {
        this.user = targetUser
        this.follower = follower
    }
}