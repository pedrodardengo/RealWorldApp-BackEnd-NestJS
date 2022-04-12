import { Entity, ManyToOne, PrimaryColumn } from "typeorm"
import { User } from "./user.entity"

@Entity({ name: "FollowRelation" })
export class FollowRelation {
  @PrimaryColumn({ type: "int", name: "userId" })
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE"
  })
  user: User

  @PrimaryColumn({ type: "int", name: "followerId" })
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: "CASCADE"
  })
  follower: User
}
