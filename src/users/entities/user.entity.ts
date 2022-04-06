import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FollowRelation } from "./follow-relation.entity";
import { Article } from "../../articles/entities/article.entity";
import { Comment } from "../../articles/entities/comment.entity";
import { hashPassword } from "src/auth/security/hash-password";
import { CreateUserDto } from "../dto/create-user.dto";

@Entity({ name: "User" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @OneToMany(() => FollowRelation, (follower) => follower.user)
  @JoinTable({ name: "FollowRelation" })
  followers: FollowRelation[];

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @ManyToMany(() => Article, (article) => article.favoritedBy)
  favoriteArticles: Article[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<string> {
    if (this.password.length < 32)
      this.password = await hashPassword(this.password);
    return this.password;
  }

  build(incomingUser: CreateUserDto): User {
    this.username = incomingUser.username;
    this.password = incomingUser.password;
    this.email = incomingUser.email;
    if (incomingUser.bio) this.bio = incomingUser.bio;
    if (incomingUser.imageUrl) this.imageUrl = incomingUser.imageUrl;
    return this;
  }
}
