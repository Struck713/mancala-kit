import type * as Party from "partykit/server";
import { error, json, notFound } from "./utils/response";
import { nanoid } from "nanoid"

export const SINGLETON_ROOM_ID = "list";

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

export default class GamesServer implements Party.Server {
  options: Party.ServerOptions = { hibernate: true };

  constructor(public room: Party.Room) {}

  async onRequest(req: Party.Request) {
    const params = new URL(req.url).searchParams;

    if (this.room.id === SINGLETON_ROOM_ID) {
      if (req.method === "POST") {
        const id = nanoid()
        await this.room.storage.put<GameInfo>(id, <GameInfo>{
          id,
          state: GameState.Waiting,
          players: [],
        });
        return json({ id })
      }

      if (req.method === "GET") {
        const id = params.get("id")
        if (!id) return error("Please provide a code.")

        const game = await this.room.storage.get<GameInfo>(id)
        console.log(await this.room.storage.list<GameInfo>())

        if (!game)
          return error("That game does not exist.")
        if (game.state == GameState.InProgress)
          return error("You cannot join a game that has already started.")

        return json(game)
      }
    }

    return notFound();
  }

}
