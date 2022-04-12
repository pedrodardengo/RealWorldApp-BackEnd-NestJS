import { Controller, Get } from "@nestjs/common"
import { TagsService } from "../services/tags.service"
import { ResponseMapper } from "../../../interceptors/dto-response-mapper.interceptor"

@Controller("/tags")
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ResponseMapper("tags")
  @Get()
  async getAllTags(): Promise<{ tags: string[] }> {
    return { tags: await this.tagsService.getAllTags() }
  }
}
