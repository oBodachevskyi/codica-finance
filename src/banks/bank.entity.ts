import { ApiProperty } from '@nestjs/swagger';
import { TransactionEntity } from 'src/transactions/transaction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'banks' })
export class BankEntity {
  @ApiProperty({ required: false })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ default: 0, required: false })
  @Column({ default: 0 })
  balance: number;

  @OneToMany(() => TransactionEntity, (transaction) => transaction.bank)
  transactions: TransactionEntity[];

  hasTransactions(): boolean {
    return !!this.transactions?.length;
  }
}
