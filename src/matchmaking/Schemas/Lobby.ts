import { Schema, ArraySchema, type } from "@colyseus/schema"
import { PlayerSeatState } from "./PlayerSeatState";

export class Lobby extends Schema {
    @type ("string") game_id !: string ;
    @type ("number") map_id !: number ;
    @type ("number") countdown !: number ;
    @type ("number") state !: LobbyState ;
    @type ([PlayerSeatState]) player_seats = new ArraySchema<PlayerSeatState>();
}

export enum LobbyState {
    Open = 1,
    Full = 2,
    Locked = 3,
    Starting = 4,
    Started = 5,
}