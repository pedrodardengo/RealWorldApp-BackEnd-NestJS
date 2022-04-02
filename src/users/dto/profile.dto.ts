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

    build(username: string, following = false, bio?: string, imageUrl?: string): ProfileDto {
        this.username = username
        this.following = Boolean(following);
        this.bio = bio;
        this.imageUrl = imageUrl;
        return this
    }
    mapFromUser(user: User, following: boolean): ProfileDto {
        this.username = user.username
        this.following = following
        if (user.bio) this.bio = user.bio
        if (user.imageUrl) this.imageUrl = user.imageUrl
        return this
    }
}