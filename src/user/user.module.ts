import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DatabaseModule } from '@src/share/module/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
