import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateBankDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 20)
  name: string;

  @ApiProperty({ required: false, default: 0 })
  @IsNumber()
  balance: number;
}
