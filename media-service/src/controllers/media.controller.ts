import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { MediaMetaDataExistsDto } from 'src/dtos/types';
import { IMediaService } from 'src/interfaces/media.interface';
import { MediaService } from 'src/services/media.service';

@Controller('/media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  constructor(
    @Inject(MediaService.name) private readonly mediaMetaDataService: IMediaService,
  ) {}

  @Get()
  healthCheck(): string {
    return 'Media Service is up and runningS';
  }

  @Post('generate-upload-url')
  async getUploadUrl(
    @Body() mediaMetaData: MediaMetaDataExistsDto,
  ): Promise<string> {
    return this.mediaMetaDataService.getSignedUrlResponse(mediaMetaData);
  }

  @Post('check-existence')
  async checkExistence(
    @Body() mediaMetaData: MediaMetaDataExistsDto,
  ): Promise<boolean> {
    return this.mediaMetaDataService.verifyMediaExists(mediaMetaData);
  }
}
