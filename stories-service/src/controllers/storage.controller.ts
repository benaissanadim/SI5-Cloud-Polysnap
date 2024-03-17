import { Controller, Get, Query, Logger } from '@nestjs/common';
import { StorageService } from '../services/storage.service';
import { UnauthorizedException } from '@nestjs/common';
import { FileNotFoundException } from '../exceptions/file-not-found.exception';

@Controller('storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name);

  constructor(private readonly storageService: StorageService) {}
  @Get('uploadUrl')
  async getUploadUrl(@Query('fileName') fileName: string, @Query('filetype') filetype: string): Promise<string> {
    try {
      this.logger.log(
        `Attempting to generate upload URL for file: ${fileName}`,
      );
      const url = await this.storageService.generate(fileName,filetype);
      this.logger.log(
        `Successfully generated upload URL for file: ${fileName}`,
        url,
      );
      return url;
    } catch (error) {
      this.logger.error(
        `Error generating upload URL for file: ${fileName}`,
        error,
      );
    }
  }
  @Get('download')
  async download(
    @Query('fileName') fileName: string,
    @Query('viewerId') viewerId: number,
    @Query('publisher') publisher: number,
  ): Promise<{ url: string }> {
    try {
      this.logger.log('Attempting to download file:', fileName);
      const { url } = {
        url: await this.storageService.download(fileName, viewerId, publisher),
      };
      this.logger.log('File downloaded successfully: ${fileName}');
      return { url };
    } catch (error) {
      if (error instanceof FileNotFoundException) {
        this.logger.error('File not found:', error);
      } else if (error instanceof UnauthorizedException) {
        this.logger.error(
          `The user ${viewerId} is not authorized to access the file ${fileName}.`,
        );
      } else {
        this.logger.error('Error during file download:', error);
      }
    }
  }
}
