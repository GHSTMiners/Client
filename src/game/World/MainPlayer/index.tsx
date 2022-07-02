import { Player } from "../Player";
import * as Schema from "matchmaking/Schemas";
import { Howler } from "howler";
export default class MainPlayer extends Player {
    constructor(scene: Phaser.Scene, player: Schema.Player) {
        super(scene, player)
        Howler.volume(1)
    }

    update(time: number, delta: number): void {
        // Update player 
        super.update(time, delta)
        Howler.pos(this.playerSchema.playerState.x, this.playerSchema.playerState.y, 0)
    }
}