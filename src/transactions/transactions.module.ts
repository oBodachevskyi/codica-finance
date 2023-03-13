import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankEntity } from 'src/banks/bank.entity';
import { BanksService } from 'src/banks/banks.service';
import { CategoryEntity } from 'src/categories/category.entity';
import { TransactionEntity } from './transaction.entity';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionWebhookController } from './webHook.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, BankEntity, CategoryEntity]),
  ],
  controllers: [TransactionsController, TransactionWebhookController],
  providers: [TransactionsService, BanksService],
})
export class TransactionsModule {}
