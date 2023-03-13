import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BanksService } from 'src/banks/banks.service';
import {
  CreateTransactionDto,
  TransactionStatisticsDto,
} from './dto/transactionsOperation.dto';
import { TransactionEntity } from './transaction.entity';
import { TransactionsService } from './transactions.service';

@ApiTags('transactions')
@Controller('api/transactions')
export class TransactionsController {
  constructor(
    private readonly transactionService: TransactionsService,
    private readonly banksService: BanksService,
  ) {}

  // get all transactions
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all transactions',
    type: [TransactionEntity],
  })
  async findAll(): Promise<TransactionEntity[]> {
    return await this.transactionService.findAll();
  }

  //get transaction by Id
  @Get(':id')
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Get transaction by Id',
    type: TransactionEntity,
  })
  async findOne(@Param('id') id: string): Promise<TransactionEntity> {
    return await this.transactionService.findOne(+id);
  }

  //create new transaction
  @Post()
  @ApiBody({ type: CreateTransactionDto })
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
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<CreateTransactionDto> {
    const transactions = await this.transactionService.create(
      createTransactionDto,
    );
    await this.banksService.updateBalance(+createTransactionDto.bank.id);
    return transactions;
  }

  //delete transaction
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Transaction succsessfuly deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete bank with transactions or Error with DB',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.transactionService.delete(+id);
    await this.banksService.updateBalance(+id);
    return;
  }

  //get  transaction statistic
  @Put('statistics')
  @ApiBody({ type: TransactionStatisticsDto })
  @ApiResponse({
    status: 200,
    description: 'get statistics in format { [key: string]: number }',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed! or Error with DB',
  })
  async getTransactionsStatistics(
    @Body()
    params: TransactionStatisticsDto,
  ): Promise<{ [key: string]: number }> {
    const { categoryIds, fromPeriod, toPeriod } = params;
    const from = new Date(fromPeriod ? fromPeriod : '1900-01-01');
    const to = new Date(toPeriod ? toPeriod : '2222-01-01');
    const statistics = await this.transactionService.getTransactionsStatistics(
      categoryIds,
      from,
      to,
    );

    return statistics;
  }
}
