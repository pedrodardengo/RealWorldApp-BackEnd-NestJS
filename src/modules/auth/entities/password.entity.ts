import { BeforeInsert, BeforeUpdate, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"
import { hashString } from "../security/hash-string"

@Entity({ name: "Password" })
export class Password {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  password: string

  @OneToOne(() => User, (user) => user.password)
  user: User

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<string> {
    if (this.password.length < 32) this.password = await hashString(this.password)
    return this.password
  }
}
