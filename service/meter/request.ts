import {AxiosPromise, AxiosResponse} from 'axios'
import * as A from '../../api'
import {MeterReading} from '../../models/MeterReading';

export const requestReadings = async () => {
  try {
    // request to localhost:8080/meter/readings
    return await A.Meter.getMeterReadings()
  } catch(err) {
    console.log(err)
  }
}
