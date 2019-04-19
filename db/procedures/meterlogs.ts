import {PoolClient} from 'pg';

export interface MeterLogRequest {
  socketId: string;
  time_stamp: number;
  apex: number;
  apexDelta: number;
  nadir: number;
  nadirDelta: number
  timeDelta: number;
}



export const insertMeterLog = async (db: PoolClient, params: MeterLogRequest): Promise<boolean> => {
  try {
    const s = `SELECT insert_meter_log(${params.socketId}, ${params.time_stamp}, ${params.apex}, ${params.apexDelta}, ${params.nadir}, ${params.nadirDelta}, ${params.timeDelta} )`
    await db.query(s)
    return
  } catch (err) {
    console.log(err)
  }
}
