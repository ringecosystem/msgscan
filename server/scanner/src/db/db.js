import postgres from 'postgres'
import dotenv from 'dotenv'
dotenv.config()

const sql = postgres({
  host: process.env.POSTGRES_HOST || 'localhost',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'postgres',
  port: process.env.POSTGRES_PORT || 5432
});

export default sql
