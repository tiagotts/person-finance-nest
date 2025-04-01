import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() createTransactionDto: Partial<Transaction>): Promise<Transaction> {
    const userId = 'temp-user-id';
    return this.transactionService.create({ ...createTransactionDto, userId });
  }

  @Get()
  async findAll(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('cardId') cardId?: string,
    @Query('categoryId') categoryId?: string,
  ): Promise<Transaction[]> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    
    const filters: any = {};
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (cardId) filters.cardId = cardId;
    if (categoryId) filters.categoryId = categoryId;

    return this.transactionService.findAll(userId, filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Transaction> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.transactionService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: Partial<Transaction>,
  ): Promise<Transaction> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.transactionService.update(id, userId, updateTransactionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.transactionService.remove(id, userId);
  }

  @Get('cards/:cardId/monthly-total')
  async getMonthlyTotal(
    @Param('cardId') cardId: string,
    @Query('month') month: string,
  ): Promise<{ total: number }> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    const monthDate = month ? new Date(month) : new Date();
    const total = await this.transactionService.getMonthlyTotal(userId, cardId, monthDate);
    return { total };
  }
}