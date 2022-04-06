import { Controller, Get } from "@nestjs/common";
import { dataWrapper } from "../../interceptors/data-wrapper.interceptor";
import { TagsService } from "../services/tags.service";

@Controller("/tags")
@dataWrapper("tags")
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get()
  async getAllTags(): Promise<string[]> {
    return this.tagsService.getAllTags();
  }
}
