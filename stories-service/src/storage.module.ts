import { Module } from '@nestjs/common';
import { StorageController } from './controllers/storage.controller';
import { StorageService } from './services/storage.service';
import { HttpModule } from '@nestjs/axios';
import { UsersProxyService } from './services/users-service-proxy/user-service-proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [StorageController],
  providers: [UsersProxyService,StorageService],
})
export class StorageModule {}
