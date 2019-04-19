const _ = require('lodash')
const chalk = require('chalk');
import {insertMeterLog, MeterLogRequest} from '../../db/procedures/meterlogs';
import {DBTables} from '../../db/tables';
import {checkoutDbClient} from '../../db/db';
import {rawQuery} from '../../db/statements/query';
import * as M from '../../models';

export async function selectLastEntries(ids: string[]) {
  const idString = ids.map(d => `'${d}'`).join(',');
  const queryString =
    `SELECT DISTINCT ON (socketid) *
		FROM ${DBTables.METER_LOG} where socketid in(${idString})
		ORDER BY socketid, time_stamp DESC;`
  const pool = await checkoutDbClient();
  const res = await rawQuery(pool, queryString);
  pool.release();
  return res
}

export const measureReadings = async (readings: M.MeterReading[]): Promise<MeterLogRequest[]> => {
  const logs = []
  try {
    const compare = await selectLastEntries(_.map(readings, (x: M.MeterReading) => x.socketId))
    _.map(readings, (x: M.MeterReading) => {
      
      const prev = _.find(compare, (log: M.MeterLog) => log.socketid == x.socketId)
      
      if (prev) {
        
        const log: MeterLogRequest = {
          socketId: `'${x.socketId}'`,
          time_stamp: Date.now(),
          apex: x.apex,
          apexDelta: prev.apex - x.apex,
          nadir: x.nadir,
          nadirDelta: prev.nadir - x.nadir,
          timeDelta: x.time_stamp - prev.time_stamp
        }
        logs.push(log)
        
      } else {
        console.log(chalk.red(`ERROR - ${x.socketId} - Prior record not found`))
      }
      
    })
    return logs
  } catch(err) {
    console.log(err)
  }
}

export const persistNewReadings = async (readings: MeterLogRequest[]) => {
  const pool = await checkoutDbClient()
  _.forEach(readings, async (r: MeterLogRequest) => {
    console.log(chalk.green(`--------- added: ${r.socketId} ----------`))
    await insertMeterLog(pool, r)
  })
  console.log(chalk.green(`---------------------`))
  console.log(chalk.green(`--------- SUCCESS ------------`))
  console.log(chalk.green(`---------------------`))
  console.log(chalk.green(`Number of records added: ${readings.length}`))
  pool.release()
}
