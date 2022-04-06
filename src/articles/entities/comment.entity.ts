import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Article } from "./article.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: "Comment" })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: "text" })
  body: string;

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  constructor(body: string, article: Article, author: User) {
    this.body = body;
    this.article = article;
    this.author = author;
  }
}
