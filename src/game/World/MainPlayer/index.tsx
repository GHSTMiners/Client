import { Player } from "../Player";
import * as Schema from "matchmaking/Schemas";

export default class MainPlayer extends Player {
    constructor(scene: Phaser.Scene, player: Schema.Player) {
        super(scene, player)
    }

    update(time: number, delta: number): void {
        super.update(time, delta)
        console.log('mainplayer update')
    }
}