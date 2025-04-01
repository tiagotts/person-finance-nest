import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  async create(createCardDto: Partial<Card>): Promise<Card> {
    const card = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(card);
  }

  async findAll(userId: string): Promise<Card[]> {
    return this.cardRepository.find({
      where: { userId },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id, userId }
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    return card;
  }

  async update(id: string, userId: string, updateCardDto: Partial<Card>): Promise<Card> {
    const card = await this.findOne(id, userId);
    
    await this.cardRepository.update({ id, userId }, updateCardDto);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.cardRepository.delete({ id, userId });
  }
}