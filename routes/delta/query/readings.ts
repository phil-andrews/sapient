const _ = require('lodash')
const chalk = require('chalk');
import {MeterReading} from '../../../models/MeterReading';
import {checkoutDbClient} from '../../../db/db';
import {DBTables} from '../../../db/tables';
import {rawQuery} from '../../../db/statements/query';
import * as M from '../../../models';

const selectRandomSockets = async () => {
  try {
    const pool = await checkoutDbClient()
    const socketQuery = `SELECT * FROM ${DBTables.SOCKET} ORDER BY RANDOM() LIMIT ${_.random(1,5)}`
    return await rawQuery(pool, socketQuery)
  } catch (err) {
    console.log(err)
    return []
  }
}

export const generateRandomReadings = async () => {
  console.log(chalk.blue('Selecting random sockets'))
  const sockets = await selectRandomSockets();
  return _.map(sockets, (x: M.Socket): MeterReading => {
    const apex = _.random(1000)
    const nadir = _.random(apex - 10)
    return {
      socketId: x.id,
      apex: apex,
      nadir: nadir,
      time_stamp: Date.now()
    }
  })
}



