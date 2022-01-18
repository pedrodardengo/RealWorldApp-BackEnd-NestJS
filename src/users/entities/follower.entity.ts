import {Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Follower {

    @PrimaryGeneratedColumn()
    id: number

    // @ManyToOne(() => User, (user) => user.followers)
    // @JoinColumn({name: 'userId'})
    // user: number
    //
    // @ManyToOne(() => User, (user) => user.following)
    // @JoinColumn({name: 'followerId'})
    // follower: number

}