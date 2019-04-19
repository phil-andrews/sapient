export interface Socket {
  id: string;
  accountId: string;
  locationId: string;
  buildingId: string;
  roomId: string;
  socketType: SocketType;
}

export enum SocketType {
  MULTI_6,
  MULTI_3,
  DOUBLE,
  SINGLE
}
