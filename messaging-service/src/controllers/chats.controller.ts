import { Controller, Get, Post, Param, Body, Delete, Query } from '@nestjs/common';
import { ChatService } from 'src/services/chat.service';
import { Chat } from 'src/entities/chat.entity';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async findAllChats(@Query('userId') id: number): Promise<Chat[]> {
    return this.chatService.findAllChatsByUser(id);
  }

  @Get(':id')
  async findChat(@Param('id') id: number): Promise<Chat> {
    return this.chatService.findChatById(id);
  }

  @Post()
  async addChat(@Body() chatData: Chat): Promise<Chat> {
    return this.chatService.addChat(chatData);
  }

  @Delete()
  async deleteAllChats(): Promise<void> {
    await this.chatService.deleteAllChats();
  }

  @Delete(':id')
  async deleteChatById(@Param('id') id: number): Promise<void> {
    await this.chatService.deleteChatById(id);
  }

  

}