import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import { IndexedArray } from "types"
import gameEvents from "game/helpers/gameEvents";

export default class RespawnManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "RespawnManager")
        this.lostCargo = {};
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerDied, this.handleDead.bind(this))
    }

    private handleDead = () => {
        Client.getInstance().ownPlayer?.cargo.forEach( entry => this.lostCargo[entry.cryptoID] = entry.amount )
        Client.getInstance().phaserGame.events.emit( gameEvents.game.LOSTCARGO, this.lostCargo )
        console.log(`My gotchi just died and lost all cargo :(`)
        console.log(this.lostCargo)
        this.lostCargo = {};
    }

    private lostCargo : IndexedArray
}