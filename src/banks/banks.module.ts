import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from 'src/transactions/transaction.entity';
import { BankEntity } from './bank.entity';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';

@Module({
  imports: [TypeOrmModule.forFeature([BankEntity, TransactionEntity])],
  controllers: [BanksController],
  providers: [BanksService],
})
export class BanksModule {}
