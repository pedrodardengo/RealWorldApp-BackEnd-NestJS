import { EntityRepository, Repository } from "typeorm"
import { Password } from "../../auth/entities/password.entity"
import { User } from "../entities/user.entity"
import { isString } from "class-validator"

@EntityRepository(Password)
export class PasswordRepository extends Repository<Password> {
  async getPasswordFromUserIdOrEmail(userId: number): Promise<Password>
  async getPasswordFromUserIdOrEmail(email: string): Promise<Password>
  async getPasswordFromUserIdOrEmail(emailOrId: string | number): Promise<Password> {
    let query = this.manager
      .createQueryBuilder()
      .from(User, "U")
      .select(["P.password as password", "P.id as id"])
    if (isString(emailOrId)) query = query.where("U.email = :email", { email: emailOrId })
    else query = query.where("U.id = :userId", { userId: emailOrId })
    return await query.innerJoin(Password, "P", "U.passwordId = P.id").getRawOne()
  }
}
