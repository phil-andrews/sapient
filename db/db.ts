import { Client, Pool, PoolClient } from 'pg';

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres',
  password: process.env.DB_PASS,
  port: 5432
}

// export const db = new Client(dbConfig)

export async function checkoutDbClient(): Promise<PoolClient> {
  const pool = new Pool(dbConfig)
  pool.on('error', (e, c) => console.log(e))
  return await pool.connect()
}
