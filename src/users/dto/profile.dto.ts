import {UserDto} from "./user.dto";
import {Expose} from "class-transformer";


export class ProfileDto extends UserDto {

    @Expose()
    following: boolean
}