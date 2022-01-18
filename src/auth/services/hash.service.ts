import {Injectable} from "@nestjs/common";
import * as bcrypt from 'bcrypt'

@Injectable()
export class HashService {
    private readonly saltRounds: number

    constructor() {
        this.saltRounds = 10
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, this.saltRounds)
    }

    async comparePasswordToHash(password: string, bcryptHash: string): Promise<boolean> {
        return bcrypt.compare(password, bcryptHash)
    }
}