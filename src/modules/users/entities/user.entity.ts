import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm"
import { FollowRelation } from "./follow-relation.entity"
import { Article } from "../../articles/entities/article.entity"
import { Comment } from "../../articles/entities/comment.entity"
import { Password } from "../../auth/entities/password.entity"

@Entity({ name: "User" })
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  bio?: string

  @Column({ nullable: true })
  imageUrl?: string

  @OneToMany(() => FollowRelation, (follower) => follower.user)
  @JoinTable({ name: "FollowRelation" })
  followers: FollowRelation[]

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[]

  @ManyToMany(() => Article, (article) => article.favoritedBy)
  favoriteArticles: Article[]

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[]

  @OneToOne(() => Password, (password) => password.user)
  @JoinColumn()
  password: Password
}
