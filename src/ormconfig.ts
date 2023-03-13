import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { BankEntity } from './banks/bank.entity';
import { CategoryEntity } from './categories/category.entity';
import {
  POSTGRESS_PORT,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PS,
  POSTGRES_USER,
} from './constans/constance';
import { TransactionEntity } from './transactions/transaction.entity';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: +POSTGRESS_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PS,
  database: POSTGRES_DB,
  entities: [CategoryEntity, TransactionEntity, BankEntity],
  synchronize: false,
  migrations: [__dirname + '/migrations/**/*{.ts, .js}'],
};

export default config;
