import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IUserService } from '../interfaces/user.interface';
import { AddContactParams, SignUpDetails } from '../dtos/types';
import { User } from '../entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { Contact } from '../entities/contact.entity';
import { UserService } from 'src/services/user.service';
import { UserNotFoundException } from '../exceptions/UserNotFound';

@Controller('/users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    @Inject(UserService.name) private readonly userService: IUserService,
  ) {}

  @Get()
  async hello() {
    return 'Hello from user controller';
  }

  @Get('search')
  searchUsers(@Query('query') query: string) {
    this.logger.log(`Received search request for ${query}`);
    if (!query)
      throw new HttpException('Provide a valid query', HttpStatus.BAD_REQUEST);
    return this.userService.findUsers(query);
  }
  @Get('contacts')
  async getContactsOfUser(@Query('UserId') userId: number): Promise<Contact[]> {
    try {
      this.logger.log(`Getting contacts of user ${userId}`);
      return this.userService.getContactsOfUser(userId);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        this.logger.log(`User with ID ${userId} not found.`);
      } else {
        this.logger.error(
          `Error fetching contacts for user with ID ${userId}:`,
          error,
        );
      }
    }
  }
  @Get('users/all')
  async getUsers(): Promise<User[]> {
    try {
      this.logger.log(`Getting contacts`);
      return this.userService.getUsers();
    } catch (error) {
      this.logger.error(`Error getting users:`, error);
    }
  }
  @Patch('contacts')
  addContact(@Body() addContactParams: AddContactParams): Promise<User> {
    this.logger.log(
      `Received add contact request for ${JSON.stringify(addContactParams)}`,
    );
    if (!addContactParams)
      throw new HttpException(
        'Provide a valid contact to add',
        HttpStatus.BAD_REQUEST,
      );
    return this.userService.addContact(addContactParams);
  }

  @Get('lookup')
  lookUpUser(
    @Query('username') username: string,
    @Query('id') id: number,
    @Query('email') email: string,
  ): Promise<User> {
    const findUserParams = { username, id, email };
    this.logger.log(
      `Received lookup request for ${JSON.stringify(findUserParams)}`,
    );
    if (!findUserParams)
      throw new HttpException(
        'Provide a valid user to look up',
        HttpStatus.BAD_REQUEST,
      );
    return this.userService.lookUpUser(findUserParams);
  }

  @Post('signup')
  signUp(@Body() userDetails: SignUpDetails): Promise<User> {
    this.logger.log(`Received sign up request for ${userDetails.username}`);
    if (!userDetails)
      throw new HttpException(
        'Provide a valid user to sign up',
        HttpStatus.BAD_REQUEST,
      );
    return this.userService.signUp(userDetails);
  }
}
