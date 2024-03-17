import { User } from '../entities/user.entity';
import { Contact } from '../entities/contact.entity';

import {
  SignUpDetails,
  LookUpUserParams,
  AddContactParams,
} from '../dtos/types';

export interface IUserService {
  signUp(userDetails: SignUpDetails): Promise<User>;
  lookUpUser(findUserParams: LookUpUserParams): Promise<User>;
  findUsers(query: string): Promise<User[]>;
  addContact(addContactParams: AddContactParams): Promise<User>;
  getContactsOfUser(userId: number): Promise<Contact[]> ;
  lookUpUserId(userId: number): Promise<User>;
  getUsers(): Promise<User[]>;
}
