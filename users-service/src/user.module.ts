import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UserService.name,
      useClass: UserService,
    },
  ],
  imports: [TypeOrmModule.forFeature([User, Contact])],
})
export class UsersModule {}
