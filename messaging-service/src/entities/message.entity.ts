/* eslint-disable prettier/prettier */
import {

} from 'typeorm';

export class MessageDTO {
  

  chatId: number;

  senderId: number;

  content: string;

  attachment: {
    type: string;
    name: string;
    link: string;
  };

  expiring: boolean;

  expirationTime: number;

  date: Date;


}