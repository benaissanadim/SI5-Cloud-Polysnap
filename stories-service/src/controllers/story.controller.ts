import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { StoryService } from '../services/story.service';
import { CreateStoryDto } from '../dto/create-story.dto';
import { StoryDto } from '../dto/story.dto';
import { UploadDto } from '../dto/upload.dto';
import { DownloadDto } from '../dto/Download.dto';
import { SaveStoryDto } from '../dto/saveStory.dto';

@Controller('story')
export class StoryController {
  private readonly logger = new Logger(StoryController.name);
  constructor(private readonly storyService: StoryService) {}

  @Get('search')
  async searchStories(@Query('query') query: string) {
    this.logger.log(`Received search request for ${query}`);
    if (!query)
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);

    return this.storyService.searchStories(query);
  }

  @Post('remove-expired')
  async removeExpiredStories() {
    return this.storyService.removeExpiredStories();
  }

  @Post('empty-db')
  async emptyStoriesDB() {
    return this.storyService.emptyStoriesDB();
  }

  @Post()
  async createStory(
    @Body() createStoryDto: CreateStoryDto,
  ): Promise<UploadDto> {
    this.logger.log(`Creating a new story`);
    return this.storyService.createStory(createStoryDto);
  }

  @Post('save')
  async saveStory(@Body() saveStoryDto: SaveStoryDto): Promise<StoryDto> {
    this.logger.log(`Saving a story`);
    return this.storyService.saveStory(saveStoryDto);
  }

  @Get('')
  async getAllStories(@Query('userId') userId: number): Promise<StoryDto[]> {
    this.logger.log(`Getting all stories`);
    return this.storyService.getAllStories(userId);
  }

  @Get('contact/:userId')
  async getContactStoryOfUser(
    @Param('userId') userId: number,
  ): Promise<DownloadDto[]> {
    this.logger.log(`Getting all stories for contact ${userId}`);
    return this.storyService.getAllStoriesForContact(userId);
  }
}
