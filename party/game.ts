import type * as Party from "partykit/server";
import { error, json, notFound, ok } from "./utils/response";
import { GamePacket, GamePacketType } from "../shared/packet";

type GameConnectionState = { username: string, score: number }
type GameConnection = Party.Connection<GameConnectionState>;

export default class GameServer implements Party.Server {
  constructor(public room: Party.Room) {}

  async onRequest(req: Party.Request) {
    if (req.method === "OPTIONS") {
      return ok();
    }
    return notFound();
  }

  async onConnect(conn: GameConnection) {

    const size = await this.room.storage.get<number>("size") ?? 0;
    const url = new URL(conn.uri).searchParams;
    const username = url.get("username")

    if (!username || size >= 2) {
      return conn.close();
    }

    await this.room.storage.put("id", this.room.id)
    await this.room.storage.put("size", size + 1)

    conn.setState({ username, score: 0 });
    this.room.broadcast(`${username} joined the game.`)
  }

  async onMessage(message: string, conn: GameConnection) {
      const packet = JSON.parse(message) as GamePacket | null;
      if (packet?.type === GamePacketType.READY) {
        this.sendPacket(conn, { type: GamePacketType.STATUS, data: "Waiting for players..." })
      }
  }

  async sendPacket(conn: GameConnection, packet: GamePacket) {
    return conn.send(JSON.stringify(packet))
  }

  // async onAlarm() {
  //   const id = await this.room.storage.get<string>("id");
  // }

}
