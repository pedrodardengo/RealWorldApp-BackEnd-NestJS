import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import {Optional} from "@nestjs/common";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    @Optional()
    bio?: string

    @Column()
    @Optional()
    imageUrl?: string

    // @OneToMany(() => Follower, (follower) => follower.userId)
    // followers: Follower[]

}