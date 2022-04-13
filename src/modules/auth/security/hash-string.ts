import * as bcrypt from "bcrypt"

export async function hashString(password: string) {
  return bcrypt.hash(password, 10)
}

export async function compareStringToHash(password: string, bcryptHash: string): Promise<boolean> {
  return bcrypt.compare(password, bcryptHash)
}
