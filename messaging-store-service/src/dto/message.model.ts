/* eslint-disable prettier/prettier */
export class MessageDTO {
    id : string;
    chatId: string;
    sender: string;
    content: string; 
    attachment: {
      type: string,
      name: string,
      link: string,
    };
    expiring: boolean;
    expirationTime : number;
}


