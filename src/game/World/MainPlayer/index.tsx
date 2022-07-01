import { Player } from "../Player";
import * as Schema from "matchmaking/Schemas";
import { Howler } from "howler";
export default class MainPlayer extends Player {
    constructor(scene: Phaser.Scene, player: Schema.Player) {
        super(scene, player)
        var self = this;
        setInterval(function() { 
            // Move listen source 
            Howler.pos(self.playerSchema.playerState.x, self.playerSchema.playerState.y, 0)
        }, 200)
    }

    update(time: number, delta: number): void {
        // Update player 
        super.update(time, delta)
        Howler.volume()
    }
}