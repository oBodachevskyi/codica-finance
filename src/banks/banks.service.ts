import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankEntity } from './bank.entity';
import { CreateBankDto } from './dto/banksOperations.dto';
import { validate } from 'class-validator';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(BankEntity)
    private readonly bankRepository: Repository<BankEntity>,
  ) {}

  // get all banks
  async findAll(): Promise<BankEntity[]> {
    return await this.bankRepository.find({
      relations: ['transactions'],
    });
  }

  //get bank by Id
  async findOne(id: number): Promise<BankEntity> {
    const existingBank = await this.bankRepository.findOne({
      where: {
        id,
      },
      relations: {
        transactions: true,
      },
    });
    if (!existingBank)
      throw new NotFoundException(`Bank with id ${id} not found`);
    return existingBank;
  }

  //create new bank
  async create(bank: CreateBankDto): Promise<BankEntity> {
    const newBank = new BankEntity();
    newBank.name = bank.name;
    newBank.balance = newBank.balance ? bank.balance : 0;
    const errors = await validate(newBank);
    if (errors.length > 0) {
      throw new BadRequestException(`Validation failed!`);
    }
    let result;
    try {
      result = await this.bankRepository.save(newBank);
    } catch (error) {
      throw new BadRequestException(`Error - ${error}`);
    }
    return result;
  }

  //update bank by Id
  async update(id: number, bank: BankEntity): Promise<BankEntity> {
    const existingBank = await this.bankRepository.findOne({ where: { id } });
    if (!existingBank)
      throw new NotFoundException(`Bank with id ${id} not found`);
    existingBank.name = bank.name;
    existingBank.balance = bank.balance;
    const errors = await validate(existingBank);
    if (errors.length > 0) throw new BadRequestException(`Validation failed!`);
    let result;
    try {
      result = await this.bankRepository.save(existingBank);
    } catch (error) {
      throw new BadRequestException(`Error - ${error}`);
    }
    return result;
  }

  //delete bank by Id
  async delete(id: number): Promise<void> {
    const existingBank = await this.bankRepository.findOne({ where: { id } });
    if (!existingBank)
      throw new NotFoundException(`Bank with id ${id} not found`);
    if (!existingBank?.hasTransactions())
      throw new BadRequestException('Cannot delete bank with transactions');

    let result;
    try {
      result = await this.bankRepository.remove(existingBank);
    } catch (error) {
      throw new BadRequestException(`Error - ${error}`);
    }
    return result;
  }

  //update bank`s balance by Id
  async updateBalance(id: number): Promise<void> {
    const existingBank = await this.bankRepository.findOne({
      where: {
        id,
      },
      relations: {
        transactions: true,
      },
    });
    if (!existingBank)
      throw new NotFoundException(`Bank with id ${id} not found`);

    const transactions = existingBank.transactions;
    for (const transaction of transactions) {
      if (transaction.type === 'profitable') {
        existingBank.balance += transaction.amount;
      } else if (transaction.type === 'consumable') {
        existingBank.balance -= transaction.amount;
      }
    }

    let result;
    try {
      result = await this.bankRepository.save(existingBank);
    } catch (error) {
      throw new BadRequestException(`Error - ${error}`);
    }
    return result;
  }
}
