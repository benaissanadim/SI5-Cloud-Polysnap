import { Injectable, Logger, NotFoundException, OnApplicationShutdown } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from 'src/entities/chat.entity';

@Injectable()
export class ChatService implements OnApplicationShutdown{

  private readonly logger = new Logger(ChatService.name);

  onApplicationShutdown() {
    this.logger.warn('Intercepting SIGNTERM');
    this.closeDBConnection();
  }

  closeDBConnection() {
    this.logger.log('DB conn closed');
  }

  async findAllChatsByUser(id: number): Promise<Chat[]> {
    console.log(id);
    const chats = await this.findAllChats();
  
    const chatsForUser = chats.filter((chat) => {
      console.log(`Checking chat ID ${chat.id}, Participants: ${chat.participants}`);
      for (let i = 0; i < chat.participants.length; i++) {
        console.log("participant id " + chat.participants[i]);
        if (chat.participants[i] == id) {
          return true;
        }
      }
      return false;
    });
  
    return chatsForUser;
  }
  
  constructor(@InjectRepository(Chat) private chatRepository: Repository<Chat>) {}

  async findChatByName(name: string): Promise<Boolean> {
    const chat = await this.chatRepository.findOne({ where: { name: name } });
    if (!chat) {
      return false;
    }
    return true;
  }

  async addChat(chatData: Chat): Promise<Chat> {
    const chatExists = await this.findChatByName(chatData.name);
    if (chatExists) {
      return null;
    }
    const newChat = this.chatRepository.create(chatData);
    return this.chatRepository.save(newChat);
  }

  async findAllChats(): Promise<Chat[]> {
    return this.chatRepository.find();
  }

  async deleteAllChats(): Promise<void> {
    await this.chatRepository.delete({}); // Deletes all chat entities
  }

  async findChatById(id: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({ where: { id: id } });
    console.log(chat);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }

  async checkChatExists(id : number): Promise<boolean>{
    const chat = await this.chatRepository.findOne({ where: { id: id } });
    console.log(chat);
    if (!chat) {
      return false;
    }
    return true;
  }

  async deleteChatById(id: number): Promise<void> {
    const chat = await this.chatRepository.findOne({ where: { id: id } });
    console.log(chat);
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    await this.chatRepository.remove(chat);
  }
}
