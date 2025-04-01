import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: TreeRepository<Category>,
  ) {}

  async create(createCategoryDto: Partial<Category>): Promise<Category> {
    if (!createCategoryDto.userId) {
      throw new BadRequestException('UserId is required');
    }

    if (createCategoryDto.parent) {
      const parent = await this.findOne(createCategoryDto.parent.id, createCategoryDto.userId);
      if (!parent) {
        throw new NotFoundException(`Parent category with ID ${createCategoryDto.parent.id} not found`);
      }
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(userId: string): Promise<Category[]> {
    const trees = await this.categoryRepository.findTrees();
    return trees.filter(tree => tree.userId === userId);
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, userId },
      relations: ['children', 'parent']
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, userId: string, updateCategoryDto: Partial<Category>): Promise<Category> {
    if (!userId) {
      throw new BadRequestException('UserId is required');
    }

    const category = await this.findOne(id, userId);

    if (updateCategoryDto.parent) {
      if (updateCategoryDto.parent.id === id) {
        throw new BadRequestException('A category cannot be its own parent');
      }

      const parent = await this.findOne(updateCategoryDto.parent.id, userId);
      const descendants = await this.categoryRepository.findDescendants(category);
      
      if (descendants.some(desc => desc.id === updateCategoryDto.parent?.id)) {
        throw new BadRequestException('Cannot set a descendant category as parent');
      }
    }

    await this.categoryRepository.update({ id, userId }, updateCategoryDto);
    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findOne(id, userId);
    
    const childrenCount = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.parentId = :id', { id })
      .andWhere('category.userId = :userId', { userId })
      .getCount();

    if (childrenCount > 0) {
      throw new BadRequestException('Cannot delete a category that has subcategories');
    }

    const transactionCount = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.transactions', 'transaction')
      .where('category.id = :id', { id })
      .andWhere('category.userId = :userId', { userId })
      .select('COUNT(transaction.id)', 'count')
      .getRawOne();

    if (transactionCount && Number(transactionCount.count) > 0) {
      throw new BadRequestException('Cannot delete a category that has transactions');
    }
    
    await this.categoryRepository.delete({ id, userId });
  }

  async addSubcategory(parentId: string, userId: string, createCategoryDto: Partial<Category>): Promise<Category> {
    const parent = await this.findOne(parentId, userId);

    const subcategory = this.categoryRepository.create({
      ...createCategoryDto,
      parent,
      userId
    });

    return this.categoryRepository.save(subcategory);
  }

  async getSubcategories(parentId: string, userId: string): Promise<Category[]> {
    const parent = await this.findOne(parentId, userId);

    return this.categoryRepository.findDescendants(parent);
  }
}