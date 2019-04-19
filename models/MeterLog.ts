import {MeterReading} from './MeterReading';

export interface MeterLog extends MeterReading {
  id?: string;
  socketId: string;
  time_stamp: number;
  apex: number;
  apexDelta: number;
  nadir: number;
  nadirDelta: number;
  timeDelta: number;
}
