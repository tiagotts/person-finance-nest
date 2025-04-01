import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CardService } from '@src/card/card.service';
import { CategoryService } from '@src/category/category.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private cardService: CardService,
    private categoryService: CategoryService,
  ) {}

  async create(createTransactionDto: Partial<Transaction>): Promise<Transaction> {
    const { cardId, categoryId, userId } = createTransactionDto;

    if (!userId || typeof userId !== 'string') {
      throw new NotFoundException('User ID is required and must be a string');
    }

    if (!cardId || typeof cardId !== 'string') {
      throw new NotFoundException('Card ID is required and must be a string');
    }

    if (!categoryId || typeof categoryId !== 'string') {
      throw new NotFoundException('Category ID is required and must be a string');
    }

    // Services will throw NotFoundException if not found
    await this.cardService.findOne(cardId, userId);
    await this.categoryService.findOne(categoryId, userId);

    const transaction = this.transactionRepository.create(createTransactionDto);
    return this.transactionRepository.save(transaction);
  }

  async findAll(userId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    cardId?: string;
    categoryId?: string;
  }): Promise<Transaction[]> {
    const where: any = { userId };

    if (filters?.startDate && filters?.endDate) {
      where.date = Between(filters.startDate, filters.endDate);
    }

    if (filters?.cardId) {
      where.cardId = filters.cardId;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    return this.transactionRepository.find({
      where,
      relations: ['card', 'category'],
      order: { date: 'DESC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, userId },
      relations: ['card', 'category']
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async update(id: string, userId: string, updateTransactionDto: Partial<Transaction>): Promise<Transaction> {
    const { cardId, categoryId } = updateTransactionDto;

    // Verify if transaction exists
    await this.findOne(id, userId);

    if (cardId) {
      const card = await this.cardService.findOne(cardId, userId);
      if (!card) {
        throw new NotFoundException(`Card with ID ${cardId} not found`);
      }
    }

    if (categoryId) {
      const category = await this.categoryService.findOne(categoryId, userId);
      if (!category) {
        throw new NotFoundException(`Category with ID ${categoryId} not found`);
      }
    }

    await this.transactionRepository.update({ id, userId }, updateTransactionDto);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.transactionRepository.delete({ id, userId });
  }

  async getMonthlyTotal(userId: string, cardId: string, month: Date): Promise<number> {
    // Verify if card exists
    await this.cardService.findOne(cardId, userId);

    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.cardId = :cardId', { cardId })
      .andWhere('transaction.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .select('COALESCE(SUM(transaction.amount), 0)', 'total')
      .getRawOne();

    return Number(result.total);
  }
}