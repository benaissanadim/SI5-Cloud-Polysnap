/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { MessageService } from './services/messages.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Message } from './entities/message.save.entity';
import { Chat } from './entities/chat.entity';
import { ChatService } from './services/chats.service';

@Module({
  
  imports: [ HttpModule,
    TypeOrmModule.forFeature([Message, Chat]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_ADDON_HOST,
      port: parseInt(process.env.POSTGRESQL_ADDON_PORT),
      username: process.env.POSTGRESQL_ADDON_USER,
      password: process.env.POSTGRESQL_ADDON_PASSWORD,
      database: process.env.POSTGRESQL_ADDON_MESSAGE_DB,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: true,
    }),],
  controllers: [MessageController],
  providers: [MessageService, ChatService]
})
export class AppModule {
  
}
