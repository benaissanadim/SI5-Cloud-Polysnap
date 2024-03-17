import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetadataAlreadyExistsError, Repository } from 'typeorm';
import { Chat } from 'src/entities/chat.entity';
import { find } from 'rxjs';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private chatRepository: Repository<Chat>) {
  }

  async findChatById(id: number): Promise<Boolean> {
    const chat = await this.chatRepository.findOne({where: {id: id}});
    if (!chat) {
      return false;
    }
    return true;
  }

  async findChatByName(name: string): Promise<Boolean> {
    const chat = await this.chatRepository.findOne({where: {name: name}});
    if (!chat) {
      return false;
    }
    return true;
  }

  async addChat(chatData: Chat): Promise<Chat> {
    let chatExists = await this.findChatByName(chatData.name);
    if(chatExists){
      return null;
    }
    const newChat = this.chatRepository.create(chatData);
    return this.chatRepository.save(newChat);
  }

  async findAllChats(): Promise<Chat[]> {
    return this.chatRepository.find();
  }

  
}