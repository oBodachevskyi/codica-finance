import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class BankDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Bank ID is required' })
  @IsNumber({}, { message: 'Bank ID must be a number' })
  id: number;
}

class CategoryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsNumber({}, { each: true })
  id: number;
}

export class CreateTransactionDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['profitable', 'consumable'])
  type: 'profitable' | 'consumable';

  @ApiProperty({ default: 'curent date', required: false })
  createdAt?: Date;

  @ApiProperty()
  @ValidateNested()
  bank: BankDto;

  @ApiProperty({ type: [CategoryDto] })
  @IsArray({ message: 'Categories must be an array' })
  @ValidateNested({ each: true, message: 'Invalid category' })
  categories: CategoryDto[];
}

export class TransactionStatisticsDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  categoryIds: number[];

  @ApiProperty({ required: false })
  @ValidateIf((dto) => dto.fromPeriod !== undefined)
  @IsDate()
  fromPeriod?: string | Date;

  @ApiProperty({ required: false })
  @ValidateIf((dto) => dto.toPeriod !== undefined)
  @IsDate()
  toPeriod?: string | Date;
}
