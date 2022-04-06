import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../../users/entities/user.entity";
import { TokenizedUser } from "../../users/types/users.types";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async addTokenToUser(user: Partial<User>): Promise<TokenizedUser> {
    const token = await this.jwtService.signAsync({ sub: user.id });
    return { ...user, token };
  }
}
