import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { CardModule } from './card/card.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Card } from './card/entities/card.entity';
import { Category } from './category/entities/category.entity';
import { Transaction } from './transaction/entities/transaction.entity';
import { ImportFile } from './import/entities/import-file.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'person_finance_db',
      entities: [User, Card, Category, Transaction, ImportFile],
      synchronize: true,
      logging: true,
      schema: 'personfinance',
    }),
    UserModule,
    CardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
// implements NestModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     // .forRoutes('user');
  //     .forRoutes({path: 'user', method: RequestMethod.POST});
  // }
}
