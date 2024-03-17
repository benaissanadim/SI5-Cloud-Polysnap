import { Module } from '@nestjs/common';
import { StoryController } from './controllers/story.controller';
import { StoryService } from './services/story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from './entities/story.entity';
import {StorageService} from "./services/storage.service";
import {HttpModule} from "@nestjs/axios";
import { UsersProxyService } from './services/users-service-proxy/user-service-proxy.service';

@Module({
  imports: [TypeOrmModule.forFeature([Story]),HttpModule],
  controllers: [StoryController],
  providers: [UsersProxyService,StoryService, StorageService],
})
export class StoryModule {}
