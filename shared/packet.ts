export enum GamePacketType {
  INPUT,
  UPDATE,
  STATUS,
  READY,
}

export type GamePacket = {
  type: GamePacketType,
  data?: any
}

export enum GameState {
  Waiting,
  InProgress,
  Ended
}

export type GameInfo = {
  id: string;
  state: GameState;
  players: string[];
};