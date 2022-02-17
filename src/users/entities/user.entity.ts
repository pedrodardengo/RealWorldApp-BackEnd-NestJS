import {Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinTable} from "typeorm";
import {Optional} from "@nestjs/common";
import {FollowRelation} from "./follow-relation.entity";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    username: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column()
    @Optional()
    bio?: string

    @Column()
    @Optional()
    imageUrl?: string

    @OneToMany(() => FollowRelation, follower => follower.user)
    @JoinTable()
    followers: FollowRelation[];

}