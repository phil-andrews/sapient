import axios, { AxiosPromise, AxiosInstance } from 'axios';
import Config from './config'
import {MeterReading} from '../models/MeterReading';


const MeterApi = axios.create({
  baseURL: `${Config.baseUrl}`,
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [JSON.stringify],
})

export const Meter = {
  getMeterReadings: (): AxiosPromise<Array<MeterReading>> => {
    return MeterApi.get(`${Config.routes.meter}/readings`);
  },
};
