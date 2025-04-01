import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: Partial<Category>): Promise<Category> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.categoryService.create({ ...createCategoryDto, userId });
  }

  @Get()
  async findAll(): Promise<Category[]> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.categoryService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.categoryService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<Category>,
  ): Promise<Category> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.categoryService.update(id, userId, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.categoryService.remove(id, userId);
  }

  @Post(':id/subcategories')
  async addSubcategory(
    @Param('id') parentId: string,
    @Body() createCategoryDto: Partial<Category>,
  ): Promise<Category> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.categoryService.addSubcategory(parentId, userId, createCategoryDto);
  }

  @Get(':id/subcategories')
  async getSubcategories(@Param('id') parentId: string): Promise<Category[]> {
    // TODO: Get userId from authentication
    const userId = 'temp-user-id';
    return this.categoryService.getSubcategories(parentId, userId);
  }
}