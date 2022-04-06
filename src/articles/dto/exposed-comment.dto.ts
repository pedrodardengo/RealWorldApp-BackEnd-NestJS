import { ProfileDto } from "../../users/dto/profile.dto";
import { Comment } from "../entities/comment.entity";

export class ExposedCommentDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  author: ProfileDto;

  mapFromCommentAndProfile(
    profile: ProfileDto,
    comment: Comment
  ): ExposedCommentDto {
    this.id = comment.id;
    this.author = profile;
    this.body = comment.body;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
    return this;
  }

  mapFromMixedData(rawResult: MixedCommentData): ExposedCommentDto {
    this.id = rawResult.id;
    this.body = rawResult.body;
    this.createdAt = rawResult.createdAt;
    this.updatedAt = rawResult.updatedAt;
    this.author = new ProfileDto().build(
      rawResult.username,
      rawResult.following,
      rawResult.bio,
      rawResult.imageUrl
    );
    return this;
  }
}

export interface MixedCommentData {
  id: number;
  body: string;
  updatedAt: Date;
  createdAt: Date;
  username: string;
  bio: string;
  imageUrl: string;
  following: boolean;
}
