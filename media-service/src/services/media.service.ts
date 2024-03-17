import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { IMediaService } from 'src/interfaces/media.interface';
import { MediaMetaDataExistsDto } from 'src/dtos/types';

@Injectable()
export class MediaService implements IMediaService, OnApplicationShutdown {
  private readonly logger = new Logger(MediaService.name);

  onApplicationShutdown() {
    this.logger.warn('Intercepting SIGNTERM');
    this.closeDBConnection();
  }

  closeDBConnection() {
    this.logger.log('DB conn closed');
  }

  constructor() {}

  async getSignedUrlResponse(
    mediaMetaData: MediaMetaDataExistsDto,
  ): Promise<string> {
    this.logger.log(
      `Getting signed URL to upload ${JSON.stringify(mediaMetaData)}`,
    );
    const storage = new Storage();

    const options = {
      version: 'v4' as const,
      action: 'write' as const,
      expires: Date.now() + 60 * 60 * 1000, // 5 minutes
      contentType: 'application/octet-stream',
    };

    const { filename, filetype, extension } = mediaMetaData;

    const path = `/media/${filetype}/${filename}.${extension}`;

    // Get a v4 signed URL for uploading file
    const [url] = await storage
      .bucket(process.env.GCLOUD_STORAGE_MEDIA_BUCKET)
      .file(path)
      .getSignedUrl(options);

    return url;
  }

  async verifyMediaExists(
    mediaMetaData: MediaMetaDataExistsDto,
  ): Promise<boolean> {
    this.logger.log(`Verifying media ${JSON.stringify(mediaMetaData)} exists`);
    const { filename, filetype, extension } = mediaMetaData;
    const storage = new Storage();
    const path = `/media/${filetype}/${filename}.${extension}`;

    // Get a v4 signed URL for uploading file
    const res = await storage
      .bucket(process.env.GCLOUD_STORAGE_MEDIA_BUCKET)
      .file(path)
      .exists();

    return res;
  }
}
