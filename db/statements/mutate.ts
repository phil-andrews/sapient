const _ = require('lodash')
import {Client, PoolClient} from 'pg';
import {DBTables} from '../tables';
import { checkoutDbClient } from '../db';


function generateInsertString(table: DBTables, columnValueMap: object) {
  
  
  // console.log(columnValueMap)
  const values = _.values(columnValueMap)
  // make all keys lowercase to match PostgreSQL formatting
  const keys = _.map(_.keys(columnValueMap), (x: string) => x.toLowerCase())
  let placeholderString = ''
  for (let i = 1; i <= values.length; i++) {
    const place = i
    if (i === values.length) {
      placeholderString += `$${place}`
    } else {
      placeholderString += `$${place}, `
    }
  }
  
  return`INSERT INTO ${table} (${_.map(keys, (x: string) => (`"${x}"`))}) VALUES (${placeholderString})`
}

export async function insertIntoTable(db: Client | PoolClient, table: DBTables, columnValueMap: object) {
  try {
    await db.query(generateInsertString(table, columnValueMap), _.values(columnValueMap))
    return
  } catch (err) {
    console.log(err)
    console.log(generateInsertString(table, columnValueMap), _.values(columnValueMap))
    // console.log(columnValueMap)
  }
  
}

export async function bulkInsert(table: DBTables, values: Array<any>) {
  const v = _.clone(values)
  return new Promise(async (resolve, reject) => {
    try {
      const client: PoolClient = await checkoutDbClient()
      function * genRows() {
        // console.log(values)
        !_.isEmpty(v) ?
          yield insertIntoTable(client, table, v.pop())
            .then(() => genRows().next())
          : resolve(() => client.release())
      }
      genRows().next()
    } catch (err) {
      // console.log(err)
      reject(err)
    }
  })
}
