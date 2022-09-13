import { Player } from "../Player";
import * as Schema from "matchmaking/Schemas";
export default class MainPlayer extends Player {
    constructor(scene: Phaser.Scene, player: Schema.Player) {
        super(scene, player)
        console.log('Main player initialized')
    }

    update(time: number, delta: number): void {
        // Update player 
        super.update(time, delta)
    }
}