import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportFile } from './entities/import-file.entity';
import { DatabaseModule } from '@src/share/module/database.module';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ImportFile]),
    MulterModule.register({
      dest: './uploads',
      preservePath: true
    })
  ],
  controllers: [ImportController],
  providers: [ImportService],
  exports: [ImportService]
})
export class ImportFileModule {}