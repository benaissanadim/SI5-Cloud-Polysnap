/* eslint-disable prettier/prettier */
import {Controller, Post } from '@nestjs/common';
import { MessagesCleanUpService } from 'src/services/messagesCleanUp.service';


@Controller("messagesCleanUp")
export class MessageCleanupController {
    constructor(private messageCleanUp : MessagesCleanUpService) {}

    @Post()
    async cleanupMessages(  ) {
        this.messageCleanUp.cleanUpMessages();
    }
}