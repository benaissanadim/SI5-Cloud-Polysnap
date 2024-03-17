/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { MessageDTO } from 'src/entities/message.entity';
import { MessageService } from 'src/services/messages.service';

@Controller("messages")
export class MessageController {
  constructor(private readonly appService: MessageService) {}

  @Post()
  async createMessage(@Body() body : MessageDTO) {
    console.log("testing");
    await this.appService.publishMessage(body);  
    return 'Message published';
  }

  @Get("redis")
  async getAllElementsFromRedis() {
    return await this.appService.getAllMessagesFromRedis();
  }

  @Post("redis/deleteAll")
  async deleteAllElementsFromRedis() {
    return await this.appService.deleteAllMessagesFromRedis();
  }

  @Post('test')
  async test(): Promise<void> {
    this.appService.test1000Messages();
  }
}