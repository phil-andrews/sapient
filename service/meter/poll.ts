const _ = require('lodash')
import {requestReadings} from './request';
import {measureReadings, persistNewReadings} from './measure';

export const startPoll = () => setInterval(async () => {
  try {
    // get readings from ts-link
    const readings = await requestReadings()
    // measure readings
    const logs = await measureReadings(readings.data)
    // persist new measures to db
    await persistNewReadings(logs)
  } catch(err) {
    console.log(err)
  }
}, 5000)
