import * as bcrypt from 'bcrypt'



export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10)
}

export async function comparePasswordToHash(password: string, bcryptHash: string): Promise<boolean> {
    return bcrypt.compare(password, bcryptHash)
}