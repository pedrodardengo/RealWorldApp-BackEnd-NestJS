import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {Tag} from "./tag.entity";
import {Comment} from "./comment.entity";
import {createSlug} from "../helper/create-slug.helper";

@Entity({name: 'Article'})
export class Article {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    slug: string

    @Column({unique: true})
    title: string

    @Column({type: "text"})
    description: string

    @Column({type: "text"})
    body: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToMany(() => Tag, tag => tag.articles)
    @JoinTable({name: 'ArticleTagRelation'})
    tagList: Tag[]

    @ManyToMany(() => User, user => user.favoriteArticles)
    @JoinTable({ name: 'FavoritedArticleRelation' })
    favoritedBy: User[]

    @ManyToOne(() => User, user => user.articles)
    @JoinTable({name: 'ArticleTagRelation'})
    author: User

    @OneToMany(() => Comment, comment => comment.article)
    comments: Comment[]

    @BeforeInsert()
    @BeforeUpdate()
    createSlug(): string {
        this.slug = createSlug(this.title)
        return this.slug
    }

    constructor(title: string, description: string, body: string, author: User, tagList: Tag[]) {
        this.title = title
        this.description = description
        this.body = body
        this.author = author
        this.tagList = tagList
    }
}