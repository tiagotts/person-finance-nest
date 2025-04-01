import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { DatabaseModule } from '@src/share/module/database.module';
import { CardModule } from '@src/card/card.module';
import { CategoryModule } from '@src/category/category.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Transaction]),
    CardModule,
    CategoryModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule {}