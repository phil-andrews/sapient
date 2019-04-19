import {MeterLog} from '../../models/MeterLog';

const _ = require('lodash')
const uuidv4 = require('uuid/v4');
import {checkoutDbClient} from '../db'
import {bulkInsert, insertIntoTable} from '../statements/mutate';
import {DBTables} from '../tables';
import * as M from '../../models';
import {insertMeterLog, MeterLogRequest} from '../procedures/meterlogs';



const companies = [
  'Cakes R Us',
  'Westbridge Group',
  'Holy Shirts & Pants',
  'Vandalay Industries',
  'Wayne Enterprises'
]

const countries = [
  'France',
  'United States',
  'Brazil',
  'Angola',
  'China',
  'Egypt',
  'Cameroon',
  'India',
  'Japan',
  'Burkina Faso'
]

async function generateLocations(accountId: string): Promise<string[]> {
  
  const locations: M.Location[] = []
  for (let i = 0; i < 5; i++) {
    const location: M.Location = {
      id: uuidv4(),
      accountId: accountId,
      country: countries[_.random(countries.length - 1)]
    }
    locations.push(location)
  }
  try {
    await bulkInsert(DBTables.LOCATION, locations)
    return _.map(locations, (x: M.Location) => x.id)
  } catch(err) {
    // console.log(err)
  }
}

async function generateBuildings(
  accountId: string,
  locations: string[]
): Promise<M.Building[]> {
  const buildings: M.Building[] = []
  for (let i = 0; i < 15; i++) {
    const building: M.Building = {
      id: uuidv4(),
      accountId: accountId,
      locationId: locations[_.random(locations.length - 1)],
      floors: _.random(40),
      lng: _.random(-179.843929, 179.99999),
      lat: _.random(-89.843929, 89.99999)
    }
    buildings.push(building)
  }
  try {
    await bulkInsert(DBTables.BUILDING, buildings)
    return buildings
  } catch(err) {
    // console.log(err)
  }
}

async function generateRooms(
  accountId: string,
  locationIds: string[],
  buildings: M.Building[]
): Promise<M.Room[]> {
  const rooms: M.Room[] = []
  for (let i = 0; i < 100; i++) {
    
    try {
      const locationId = locationIds[_.random(locationIds.length - 1)]
      const b = _.filter(buildings, (x: M.Building) => x.locationId == locationId)
      const building = b[_.random(b.length - 1)]
      const room: M.Room = {
        id: uuidv4(),
        accountId: accountId,
        locationId: locationId,
        buildingId: building.id,
        floor: _.random(building.floors)
      }
      rooms.push(room)
    } catch(err) {
      console.log(err)
    }
  }
  try {
    await bulkInsert(DBTables.ROOM, rooms)
    return rooms
  } catch(err) {
    // console.log(err)
  }
}

async function generateSockets(
  accountId: string,
  locationIds: string[],
  buildings: M.Building[],
  rooms: M.Room[]
): Promise<M.Socket[]> {
  const sockets: M.Socket[] = []
  for (let i = 0; i < 100; i++) {
    try {
      const locationId = locationIds[_.random(locationIds.length - 1)]
      const b = _.filter(buildings, (x: M.Building) => x.locationId == locationId)
      const building = b[_.random(b.length - 1)]
      const r: M.Room[] = _.filter(rooms, (x: M.Room) => x.buildingId == building.id)
      const room: M.Room = r[_.random(r.length - 1)]
      // console.log(room)
      const socket: M.Socket = {
        id: uuidv4(),
        accountId: accountId,
        locationId: locationId,
        buildingId: building.id,
        roomId: room.id,
        socketType: _.random(3) as M.SocketType
      }
      sockets.push(socket)
    } catch(err) {
      console.log(err)
    }
  }
  try {
    await bulkInsert(DBTables.SOCKET, sockets)
    return sockets
  } catch(err) {
    // console.log(err)
  }
}

export const createMockEntities = async () => {
  const pool = await checkoutDbClient()
  _.map(companies, async (x: string) => {
    const account: M.Account = {
      id: uuidv4(),
      company: companies.pop()
    }
    await insertIntoTable(pool, DBTables.ACCOUNT, account)
    const locationIds = await generateLocations(account.id)
    const buildings = await generateBuildings(account.id, locationIds)
    const rooms = await generateRooms(account.id, locationIds, buildings)
    const sockets = await generateSockets(account.id, locationIds, buildings, rooms)
    const readings = await generateMockReadings(sockets)
  })
}

export const generateMockReadings = async (sockets?: M.Socket[]) => {
  const pool = await checkoutDbClient()
  _.map(sockets, async (x: M.Socket) => {
    for (let i = 0; i < 25; i++) {
      const apex = _.random(1000);
      const nadir = _.random(1000)
      const timestamp = Date.now();
      const log: MeterLogRequest = {
        socketId: `'${x.id}'`,
        time_stamp: timestamp,
        apex: apex,
        apexDelta: apex - _.random(300),
        nadir: nadir,
        nadirDelta: nadir + _.random(300),
        timeDelta: timestamp - (timestamp - _.random(500))
      }
      const res = await insertMeterLog(pool, log)
    }
    pool.release()
  
  })
}

