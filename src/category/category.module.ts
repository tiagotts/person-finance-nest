import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { DatabaseModule } from '@src/share/module/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Category])
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}