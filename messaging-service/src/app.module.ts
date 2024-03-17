import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { ChatController } from './controllers/chats.controller';
import { MessageService } from './services/messages.service';
import { ChatService } from './services/chat.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from './entities/user.entity';
import { UserProxyService } from './services/user.proxy.service';
import { join } from 'path';


@Module({
  imports: [ HttpModule,
    TypeOrmModule.forFeature([Chat, User]),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_ADDON_HOST,
      port: parseInt(process.env.POSTGRESQL_ADDON_PORT),
      username: process.env.POSTGRESQL_ADDON_USER,
      password: process.env.POSTGRESQL_ADDON_PASSWORD,
      database: process.env.POSTGRESQL_ADDON_MESSAGE_DB,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
    })],
  providers: [MessageService, ChatService, UserProxyService],
  controllers: [MessageController, ChatController], // Include your service here
})
export class AppModule {}
