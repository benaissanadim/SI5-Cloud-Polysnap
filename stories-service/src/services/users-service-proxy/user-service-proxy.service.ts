import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ContactDto } from '../../dto/contact.dto';
import { DependenciesConfig } from '../../shared/config/interfaces/dependencies-config.interface';

const logger = new Logger('UsersProxyService');

@Injectable()
export class UsersProxyService {
  private _baseUrl: string;
  private _usersServicePath = 'users';
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ){
    const dependenciesConfig =
      this.configService.get<DependenciesConfig>('dependencies');
    this._baseUrl = `${dependenciesConfig.user_service_url}`;
  }
  async getContactOfUser(userId: number): Promise<ContactDto[]> {
    try {
      logger.log(
        `${this._baseUrl}${this._usersServicePath}/contacts?UserId=${userId}`,
      );
      const response: AxiosResponse<ContactDto[]> = await firstValueFrom(
        this.httpService.get<ContactDto[]>(
          `${this._baseUrl}${this._usersServicePath}/contacts?UserId=${userId}`,
        ),
      );
      logger.log(`retrieving user contacts  successfully`);

      return response.data;
    } catch (error) {
      logger.log('Error while fetching users:', error);
      throw error;
    }
  }
}
