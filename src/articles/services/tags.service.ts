import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "../entities/tag.entity";
import { Repository } from "typeorm";

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagsRepo: Repository<Tag>) {}

  async getAllTags(): Promise<string[]> {
    const listTags = await this.tagsRepo.find({ select: ["name"] });
    return listTags.map((item) => item.name);
  }

  async fetchTagsCreatingThoseThatDoesntExist(tags: string[]): Promise<Tag[]> {
    const allTags: Tag[] = tags.map((tagName) => new Tag(tagName));
    await this.tagsRepo.manager
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(allTags)
      .orIgnore()
      .execute();
    return await this.tagsRepo.manager
      .createQueryBuilder()
      .from(Tag, "Tag")
      .where("Tag.name in (:...tags)", { tags })
      .getRawMany();
  }
}
