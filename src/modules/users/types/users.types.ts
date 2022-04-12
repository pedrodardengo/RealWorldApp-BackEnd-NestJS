import { User } from "../entities/user.entity"

export type TokenizedUser = { token: string } & Partial<User>

export type UserWithFollowingInfo = { following: boolean } & Partial<User>

export type FindOption = {
  id?: number
  email?: string
  username?: string
}
