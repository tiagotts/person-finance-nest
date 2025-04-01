import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';

@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  async create(@Body() createCardDto: Partial<Card>): Promise<Card> {
    return this.cardService.create(createCardDto);
  }

  @Get()
  async findAll(): Promise<Card[]> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.cardService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Card> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.cardService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCardDto: Partial<Card>,
  ): Promise<Card> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.cardService.update(id, userId, updateCardDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.cardService.remove(id, userId);
  }
}