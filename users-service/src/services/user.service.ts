import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository, Like, getConnectionManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  SignUpDetails,
  LookUpUserParams,
  AddContactParams,
} from '../dtos/types';
import { IUserService } from '../interfaces/user.interface';
import { UserAlreadyExists } from 'src/exceptions/UserAlreadyExists';
import { UserNotFoundException } from 'src/exceptions/UserNotFound';
import { ContactAlreadyExists } from 'src/exceptions/ContactAlreadyExists';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class UserService implements IUserService, OnApplicationShutdown {
  private readonly logger = new Logger(UserService.name);

  onApplicationShutdown() {
    this.logger.warn('Intercepting SIGNTERM');
    this.closeDBConnection();
  }

  closeDBConnection() {
    this.logger.log('DB conn closed');
  }

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async signUp(userDetails: SignUpDetails): Promise<User> {
    this.logger.log(`Signing up user ${userDetails.username}`);
    const existingUser = await this.usersRepository.findOneBy([
      { username: userDetails.username },
      { email: userDetails.email },
    ]);
    if (existingUser) {
      this.logger.error(`User ${userDetails.username} already exists`);
      throw new UserAlreadyExists();
    }
    const user = this.usersRepository.create(userDetails);
    return await this.usersRepository.save(user);
  }

  async findUsers(query: string): Promise<User[]> {
    this.logger.log(`Searching for users with query ${query}`);
    return await this.usersRepository.find({
      where: { username: Like(`%${query}%`) },
      take: 10,
      select: ['id', 'username', 'email', 'firstName', 'lastName'],
    });
  }

  async lookUpUser(findUserParams: LookUpUserParams): Promise<User> {
    this.logger.log(`Looking up user ${JSON.stringify(findUserParams)}`);
    const user = await this.usersRepository.findOneBy([
      { id: findUserParams.id },
      { email: findUserParams.email },
      { username: findUserParams.username },
    ]);
    if (!user) {
      this.logger.error(`User ${JSON.stringify(findUserParams)} not found`);
      throw new UserNotFoundException();
    }
    return user;
  }

  async lookUpUserId(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User id ${userId} not found`);
      throw new UserNotFoundException();
    }
    return user;
  }

  async getContactsOfUser(userId: number): Promise<Contact[]> {
    const user = this.lookUpUserId(userId);

    const contacts = await this.contactRepository.find({
      where: { userId: userId },
    });
    return contacts;
  }
  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users;
  }

  async addContact(addContactParams: AddContactParams): Promise<User> {
    this.logger.log(`Adding contact ${JSON.stringify(addContactParams)}`);

    const user = await this.usersRepository.findOne({
      where: { id: addContactParams.userId },
    });

    if (!user) {
      this.logger.error(`User ${addContactParams.userId} not found`);
      throw new UserNotFoundException();
    }

    const contactExists = await this.contactRepository.findOne({
      where: {
        userId: addContactParams.userId,
        contactId: addContactParams.contactId,
      },
    });

    if (contactExists) {
      this.logger.error(`Contact ${addContactParams.contactId} already exists`);
      throw new ContactAlreadyExists();
    }

    const newContact = this.contactRepository.create({
      userId: addContactParams.userId,
      contactId: addContactParams.contactId,
    });

    await this.contactRepository.save(newContact);

    return user;
  }
}
