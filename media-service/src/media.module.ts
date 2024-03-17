import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';

@Module({
  controllers: [MediaController],
  providers: [
    {
      provide: MediaService.name,
      useClass: MediaService,
    },
  ],
})
export class MediaModule {}
