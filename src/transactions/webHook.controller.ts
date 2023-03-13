import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateTransactionDto } from './dto/transactionsOperation.dto';
import { TransactionsService } from './transactions.service';
import { BanksService } from 'src/banks/banks.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionEntity } from './transaction.entity';

@ApiTags('transactions')
@Controller('webhook/transactions')
export class TransactionWebhookController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly banksService: BanksService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create new transaction',
    type: TransactionEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed! or Error with DB',
  })
  @ApiResponse({
    status: 404,
    description: 'Bank/ categories not found',
  })
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(@Body() transactionDto: CreateTransactionDto) {
    const transactions = await this.transactionsService.create(transactionDto);
    await this.banksService.updateBalance(+transactionDto.bank.id);
    await this.transactionsService.create(transactionDto);
    return { success: true, transactions };
  }
}
