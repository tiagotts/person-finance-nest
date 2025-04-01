import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { DatabaseModule } from '@src/share/module/database.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { ImportFileModule } from '@src/import/import.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Card]),
    ImportFileModule
  ],
  controllers: [CardController],
  providers: [CardService],
  exports: [CardService]
})
export class CardModule {}