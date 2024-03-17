import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserProxyService {
  
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async findById(userId: number): Promise<boolean> {
    const usersUrl = "https://users-dot-cloud-398911.lm.r.appspot.com/users/lookup?id=" + userId;
    
    try {
      const response = await fetch(usersUrl);
  
      if (response.status === 404) {
        console.log(`User id ${userId} not found (HTTP 404)`);
        return false;
      }
  
      const data = await response.json();
  
      if (!data) {
        console.log(`User id ${userId} not found (no data)`);
        return false;
      }
  
      // Handle the case when the user is found
      console.log(data);
      return true;
    } catch (error) {
      console.error(`Error while fetching user id ${userId}:`, error);
      return false;
    }
  }
}