import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { StoryModule } from './story.module';
import { StorageModule } from './storage.module';
import { UsersProxyService } from './services/users-service-proxy/user-service-proxy.service';
import dependenciesConfig from './shared/config/dependencies.config';
import { ConfigModule } from '@nestjs/config';
import {HttpModule} from "@nestjs/axios";
@Module({
  imports: [
  HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dependenciesConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_ADDON_HOST,
      port: parseInt(process.env.POSTGRESQL_ADDON_PORT),
      username: process.env.POSTGRESQL_ADDON_USER,
      password: process.env.POSTGRESQL_ADDON_PASSWORD,
      database: process.env.POSTGRESQL_ADDON_DB,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
    }),
    StoryModule,
    StorageModule,
  ],
  controllers: [],
  providers: [UsersProxyService],
})
export class AppModule {}
