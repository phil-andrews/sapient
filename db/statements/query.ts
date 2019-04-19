import {Client, PoolClient, QueryResult} from 'pg';
import {DBTables} from '../tables';

export async function rawQuery(db: PoolClient, query: string) {
  try {
    const req: QueryResult = await db.query(query)
    return req.rows
  } catch(err) {
    console.log(err)
    return []
  }
}

export async function selectWhere(db: Client, table: DBTables, whereClause: string) {
  const dbString = `SELECT * FROM ${table} ` + whereClause
  const req: QueryResult = await db.query(dbString)
  return req.rows
}
