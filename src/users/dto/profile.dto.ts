import {Expose} from "class-transformer";
import {User} from "../entities/user.entity";


export class ProfileDto {

    @Expose()
    username: string

    @Expose()
    following: boolean

    @Expose()
    bio?: string

    @Expose()
    imageUrl?: string


    constructor(user: User, following: boolean) {
        if (user != undefined && following !== undefined) {
            this.username = user.username
            this.following = following
            if (user.bio) this.bio = user.bio
            if (user.imageUrl) this.imageUrl = user.imageUrl
        }
    }
}