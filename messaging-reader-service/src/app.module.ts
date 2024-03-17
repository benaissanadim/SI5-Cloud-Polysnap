import { Module } from '@nestjs/common';
import { MessageController } from './controllers/messages.controller';
import { MessageService } from './services/messages.service';
import { MessagesCleanUpService } from './services/messagesCleanUp.service';
import { MessageCleanupController } from './controllers/messagesCleanUp.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Chat } from './entities/chat.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Message, Chat, User]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_ADDON_HOST,
      port: parseInt(process.env.POSTGRESQL_ADDON_PORT),
      username: process.env.POSTGRESQL_ADDON_USER,
      password: process.env.POSTGRESQL_ADDON_PASSWORD,
      database: process.env.POSTGRESQL_ADDON_MESSAGE_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      }),
  ],
  controllers: [MessageController, MessageCleanupController],
  providers: [MessageService, MessagesCleanUpService],
})
export class AppModule {}
