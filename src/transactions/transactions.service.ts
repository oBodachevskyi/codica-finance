import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankEntity } from 'src/banks/bank.entity';
import { CategoryEntity } from 'src/categories/category.entity';
import { Repository } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { validate } from 'class-validator';
import {
  CreateTransactionDto,
  TransactionStatisticsDto,
} from './dto/transactionsOperation.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(BankEntity)
    private readonly bankRepository: Repository<BankEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  // get all transactions
  async findAll(): Promise<TransactionEntity[]> {
    return await this.transactionRepository.find({
      relations: {
        categories: true,
        bank: true,
      },
    });
  }

  //get transaction by Id
  async findOne(id: number): Promise<TransactionEntity> {
    const existingTransaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
      relations: {
        categories: true,
        bank: true,
      },
    });
    if (!existingTransaction)
      throw new NotFoundException(`Transaction with id ${id} not found`);
    return existingTransaction;
  }

  //create new transaction
  async create(createTransactionDto: CreateTransactionDto) {
    //check bank for creating transaction
    const newTransaction = new CreateTransactionDto();
    newTransaction.amount = createTransactionDto.amount;
    newTransaction.type = createTransactionDto.type;
    newTransaction.bank = createTransactionDto.bank;
    newTransaction.categories = createTransactionDto.categories;

    if (createTransactionDto?.createdAt) {
      newTransaction.createdAt = createTransactionDto.createdAt;
    }
    const errors = await validate(newTransaction);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed!`);
    }
    const existingBank = await this.bankRepository.findOne({
      where: {
        id: createTransactionDto.bank.id,
      },
    });
    if (!existingBank)
      throw new NotFoundException(
        `Bank with id ${createTransactionDto.bank.id} not found`,
      );
    //check categories for creating transaction
    const categories = await this.categoryRepository.findByIds(
      createTransactionDto.categories,
    );
    if (categories.length !== createTransactionDto.categories.length) {
      throw new NotFoundException(`One or more categories not found`);
    }
    let result;
    try {
      result = await this.transactionRepository.save(newTransaction);
    } catch (error) {
      throw new BadRequestException(`Error - ${error}`);
    }
    return result;
  }

  //delete transaction byId
  async delete(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }

  async getTransactionsStatistics(
    categoryIds: number[],
    fromPeriod: Date,
    toPeriod: Date,
  ): Promise<{ [categoryName: string]: number }> {
    if (categoryIds.length <= 0) {
      throw new BadRequestException(`Add one or more categories`);
    }
    const newReq = new TransactionStatisticsDto();
    newReq.categoryIds = categoryIds;
    newReq.fromPeriod = fromPeriod;
    newReq.toPeriod = toPeriod;
    const errors = await validate(newReq);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed!`);
    }
    const transactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.categories', 'category')
      .where('category.id IN (:...categoryIds)', { categoryIds })
      .andWhere('transaction.createdAt >= :fromPeriod', { fromPeriod })
      .andWhere('transaction.createdAt <= :toPeriod', { toPeriod })
      .getMany();

    const categoryBalances: { [categoryName: string]: number } = {};
    for (const transaction of transactions) {
      for (const category of transaction.categories) {
        const categoryName = category.name;
        const amount =
          transaction.type === 'profitable'
            ? transaction.amount
            : -transaction.amount;

        if (!categoryBalances[categoryName]) {
          categoryBalances[categoryName] = 0;
        }
        categoryBalances[categoryName] += amount;
      }
    }

    return categoryBalances;
  }
}
