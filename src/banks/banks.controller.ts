import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BankEntity } from './bank.entity';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/banksOperations.dto';

@ApiTags('banks')
@Controller('api/banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  // get all banks
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all banks',
    type: [BankEntity],
  })
  async findAll(): Promise<BankEntity[]> {
    return await this.banksService.findAll();
  }

  //get bank by Id
  @Get(':id')
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 200,
    description: 'Get bank by Id',
    type: BankEntity,
  })
  async findOne(@Param('id') id: string): Promise<BankEntity> {
    return await this.banksService.findOne(+id);
  }

  //create new bank
  @Post()
  @ApiBody({ type: CreateBankDto })
  @ApiResponse({
    status: 201,
    description: 'Create new bank',
    type: BankEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed! or Error with DB',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() bank: CreateBankDto): Promise<BankEntity> {
    return await this.banksService.create(bank);
  }

  //update bank by Id
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Update currently bank',
    type: BankEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed! or Error with DB',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  async update(
    @Param('id') id: string,
    @Body() bank: BankEntity,
  ): Promise<BankEntity> {
    return await this.banksService.update(+id, bank);
  }

  //delete bank by Id
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Bank succsessfuly deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete bank with transactions or Error with DB',
  })
  async delete(@Param('id') id: string): Promise<void> {
    return await this.banksService.delete(+id);
  }
}
