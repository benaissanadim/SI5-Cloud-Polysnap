import { Injectable, Logger, NotFoundException, OnApplicationShutdown } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { addMinutes } from 'date-fns';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class MessageService implements OnApplicationShutdown{
  private readonly messageRepository: Repository<Message>;
  private readonly logger = new Logger(MessageService.name);

  onApplicationShutdown() {
    this.logger.warn('Intercepting SIGNTERM');
    this.closeDBConnection();
  }

  closeDBConnection() {
    this.logger.log('DB conn closed');
  }

  constructor(@InjectRepository(Message) messageRepository: Repository<Message>,
  @InjectRepository(User) userRepository: Repository<User>,
  ) {
    this.messageRepository = messageRepository;
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find({
      order: {
        date: 'DESC'
      }
    });
  }

  async getAllMessagesByNumbers(chatId: number, userId: number, n: number): Promise<any[]> {
  
    console.log("getting all messages begin by numbers");
  
  const filteredMessages2 = await this.messageRepository
  .createQueryBuilder('entity')
  .where('entity.chatId = :chatId', { chatId })
  .andWhere(
    '((entity.expiring = false) OR ' +
    '(CAST(entity.seenBy AS TEXT) NOT LIKE :userId AND entity.expirationTime = 0 AND entity.expiring = true) OR ' +
    '(entity.expiring = true AND entity.expirationTime > 0 AND ' +
    'entity.date + make_interval(mins => entity.expirationTime) > :currentDate))',
    { userId: `%${userId}%`, currentDate: new Date() }
  )
  .orderBy('entity.date', 'DESC')
  .limit(n)
  .getMany();
  const filteredMessagesReversed = filteredMessages2.reverse();

    

    this.updateMessages(userId, filteredMessages2);

    return filteredMessagesReversed;
  }

  
  async updateMessages(userId: number, messages: Message[]): Promise<void> {
    const messageIds = messages
  .filter((message) => {
    for (const s of message.seenBy) {
      if (s == userId){
        return false;
      } 
    }
    return true;
  })
  .map((message) => message.id);
  
    if (messageIds.length === 0) {
      return;
    }
  
    await this.messageRepository.createQueryBuilder()
    .update(Message)
    .set({ seenBy: () => `seenBy || '[${userId}]'::jsonb` })
    .where("id IN (:...messageIds)", { messageIds })
    .execute();
  }

  async deleteAll(): Promise<void> {
    await this.messageRepository.createQueryBuilder()
      .delete()
      .from(Message)
      .execute();
  }
/*
  async getAllMessagesFromDate(chatId: number, userId: number, specificDate: Date): Promise<any[]> {
  
    console.log("getting all messages begin from date " + specificDate);

    let entities = await this.findAll();
    
    const filteredMessages = entities.filter(entity => new Date(entity.date) >= specificDate
    && entity.chatId == chatId && (
      (!entity.expiring || !entity.seenBy.includes(userId) ) ||
       (( entity.expirationTime != null || entity.expirationTime != 0) && 
        addMinutes(entity.date, entity.expirationTime) > new Date()) ) );
  
      console.log("getting unread message end filtering")

    console.log("getting all messages end filtering");
  
    for (const message of filteredMessages) {
      console.log("messages " + message.toString());
      //this.updateMessage(message, userId);
    }
  
    return filteredMessages;
  }


  async getUnreadMessages(chatId: number, userId: number): Promise<Message[]> {
    const start = performance.now();

    console.log("getting unread message begin");
  
    const messages = await this.messageRepository.createQueryBuilder("message")
    .where("message.chatId = :chatId", { chatId })
    .andWhere((qb) => {
      qb.where("NOT EXISTS (SELECT 1 FROM jsonb_array_elements(message.seenBy) AS seen WHERE seen = :userId)", { userId : userId.toString() })
    })
    .andWhere("message.expirationTime IS NULL OR message.expirationTime = 0 OR message.date + (message.expirationTime * interval '1 minute') > NOW()")
    .orderBy("message.date", "ASC")
    .getMany();
    
    const end = performance.now();
    console.log(`Execution time: ${end - start} milliseconds`);  
  
    return messages;
  }
  */

  async deleteMessage(messageId: number): Promise<void> {
    const messageToDelete = await this.messageRepository.findOne({where: {id: messageId}});
  
    if (!messageToDelete) {
      throw new NotFoundException(`Message ${messageId} not found`);
    }
  
    await this.messageRepository.remove(messageToDelete);
  }
  

}