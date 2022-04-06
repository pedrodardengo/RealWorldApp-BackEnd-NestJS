import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Article} from "./article.entity";


@Entity({name: 'Tag'})
export class Tag {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    name: string

    @ManyToMany(() => Article, article => article.tagList)
    articles: Article[]

    constructor(name: string) {
        this.name = name
    }
}