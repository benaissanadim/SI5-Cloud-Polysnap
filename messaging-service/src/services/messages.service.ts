/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import Redis from 'ioredis';
import { MessageDTO } from 'src/entities/message.entity';
import { ChatService } from './chat.service';
import { UserProxyService } from './user.proxy.service';


@Injectable()
export class MessageService {

  private pubsub: PubSub;
  private redisClient: Redis;
  
  constructor(private  chatService: ChatService,
    private  userService : UserProxyService) {
    this.pubsub = new PubSub({
    });

    this.redisClient = new Redis({
      host:process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }


  async deleteAllMessagesFromRedis() {
    try {
      // Supprimer toutes les clés de Redis
      const keys = await this.redisClient.keys('*');
      if (keys.length > 0) {
        console.log('Deleting messages from Redis...');
        await this.redisClient.del(...keys);
        console.log('Messages deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting messages from Redis:', error);
      throw error;
    }
  }
  


async getAllMessagesFromRedis(): Promise<MessageDTO[]> {
  try {
    // Get all keys from Redis
    const keys = await this.redisClient.keys('*');
    
    // Create an array to store the parsed messages
    const messages: MessageDTO[] = [];

    const now = new Date();
    const utcNow = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
    ));

    // Fetch the values for each key, parse the JSON, and create MessageDTO objects
    for (const key of keys) {
      const value = await this.redisClient.get(key);
      if (value) {
        const parsedValue = JSON.parse(value);
        if (parsedValue) {
          // Ensure the parsed data matches the structure of MessageDTO
          const messageDTO: MessageDTO = {
            chatId: parsedValue.chatId,
            senderId: parsedValue.senderId,
            content: parsedValue.content,
            attachment: parsedValue.attachment,
            expiring: parsedValue.expiring,
            expirationTime: parsedValue.expirationTime,
            date: utcNow,
          };
          messages.push(messageDTO);
        }
      }
    }

    return messages;
  } catch (error) {
    console.error('Error getting messages from Redis:', error);
    throw error;
  }
}

async test1000Messages() {

  const now = new Date();
  const utcNow = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
  ));
  for (let i = 0; i < 1000; i++) {
    const message: MessageDTO = {

      chatId: 1,

      senderId: 1,
    
      content: "hello "+ i,
    
      attachment: {
        type: "test",
        name: "test",
        link: "test",
      },
    
      expiring: false,
    
      expirationTime: 0,
    
      date: utcNow,
    
    };

    // Publish the generated message
    await this.publishMessage(message);
  }
}


  async publishMessage(message: MessageDTO): Promise<void> {
/*

      const bool = await this.chatService.checkChatExists(message.chatId);
      if(!bool){
        throw new NotFoundException("chat not found exception");
      }
      const bool2 = await this.userService.findById(message.senderId);
      if(!bool2){
        throw new NotFoundException("user not found exception");
      }
      */

    const now = new Date();

    const utcNow = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds(),
        now.getUTCMilliseconds()
    ));

      const topicName = process.env.PUB_SUB_TOPIC;

      const timestamp = utcNow.getTime();
      const random = Math.random().toString(36).substring(2, 10); 

      const uniqueKey = `${timestamp}-${random}`;
      this.redisClient.set(uniqueKey, JSON.stringify(message));
  
      // Publish the message
      const messageId = await this.pubsub
        .topic(topicName)
        .publishJSON(message);


      console.log(`Message ${messageId} published.`);
      console.log('Message published successfully.');
  }

}

