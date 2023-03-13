import * as dotenv from 'dotenv';

dotenv.config();

export const {
  PORT,
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PS,
  POSTGRESS_PORT,
} = process.env;
