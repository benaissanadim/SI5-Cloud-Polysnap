import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { UsersProxyService } from '../../services/users-service-proxy/user-service-proxy.service';

const logger = new Logger('StartupLogicService');

export class StartupLogicService implements OnApplicationBootstrap {
  sites = [];
  constructor(
       private readonly usersProxyService: UsersProxyService,
  ) {}
  async onApplicationBootstrap() {}

}