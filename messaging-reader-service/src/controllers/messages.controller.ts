/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Query, Delete } from '@nestjs/common';
import { MessageService } from 'src/services/messages.service';

@Controller("messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
/*
  @Get('unread')
  async getUnreadMessages(
    @Query('chatId') chatId: number,
    @Query('userId') userId: number,
  ): Promise<any[]> {
    return this.messageService.getUnreadMessages(chatId, userId);
  }
  */

  @Get('all')
  async get(
  ): Promise<any[]> {
    return this.messageService.findAll();
  }
/*
  @Get('from-date')
  async getAllMessagesFromDate(
    @Query('chatId') chatId: number,
    @Query('userId') userId: number,
    @Query('date') date: string,
  ): Promise<any[]> {
    return this.messageService.getAllMessagesFromDate(chatId, userId, new Date(date));
  }
  */

  @Get()
  async getAllMessages(
    @Query('chatId') chatId: number,
    @Query('number') number: number,
    @Query('userId') userId: number,
  ): Promise<any[]> {
    
    return this.messageService.getAllMessagesByNumbers(chatId, userId, number);
  }

  @Delete('all')
  async deleteAllMessages(): Promise<void> {
    await this.messageService.deleteAll();
  }

}