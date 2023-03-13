import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/categoriesOperationsType.dto';
import { validate } from 'class-validator';
import { TransactionEntity } from 'src/transactions/transaction.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  // get all categories
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  // get category by id
  async findOne(id: number): Promise<CategoryEntity> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return existingCategory;
  }

  //create new category
  async create(category: CreateCategoryDto): Promise<CreateCategoryDto> {
    const newCategory = new CategoryEntity();
    newCategory.name = category.name;
    const errors = await validate(newCategory);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed!`);
    }
    let result;
    try {
      result = await this.categoryRepository.save(newCategory);
    } catch (error) {
      throw new BadRequestException(`Error - ${error}`);
    }
    return result;
  }

  //update category by Id
  async update(
    id: number,
    category: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    const newCategory = new CategoryEntity();
    newCategory.name = category.name;
    const errors = await validate(newCategory);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed!`);
    }
    let result;
    try {
      result = await this.categoryRepository.update(id, category);
    } catch (error) {
      throw new BadRequestException(`Error - ${error}`);
    }
    return result;
  }

  //delete category by Id
  async delete(id: number): Promise<void> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!existingCategory) {
      throw new BadRequestException(`Category with id ${id} not found`);
    }
    const transactionsUsingCategory = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.categories', 'category')
      .where('category.id = :id', { id })
      .getMany();

    if (transactionsUsingCategory.length > 0) {
      throw new BadRequestException(
        'Cannot delete category, transactions are using it.',
      );
    }
    let result;
    try {
      result = await this.categoryRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(`Error - ${error}`);
    }
    return result;
  }
}
