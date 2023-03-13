import { ApiProperty } from '@nestjs/swagger';
import { BankEntity } from 'src/banks/bank.entity';
import { CategoryEntity } from 'src/categories/category.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @ApiProperty({ required: false })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  amount: number;

  @ApiProperty({ enum: ['profitable', 'consumable'] })
  @Column()
  type: 'profitable' | 'consumable';

  @ApiProperty({ default: 'CURRENT DATA', required: false })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ type: [CategoryEntity] })
  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  categories: CategoryEntity[];

  @ApiProperty()
  @ManyToOne(() => BankEntity, (bank) => bank.transactions)
  bank: BankEntity;
}
