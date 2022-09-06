import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import { IndexedArray } from "types"
import gameEvents from "game/helpers/gameEvents";
import { Crystal } from "game/World/Crystal";

export default class RespawnManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "RespawnManager")
        this.lostCargo = {};
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerDied, this.handleDead.bind(this))
        //Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerRespawned, this.handleRespawn.bind(this))
    }

    private handleDead = () => {
        Client.getInstance().ownPlayer?.cargo.forEach( entry => {
            this.lostCargo[entry.cryptoID] = entry.amount
            for (let i = 0; i < entry.amount; i++) new Crystal(this.scene, entry.cryptoID.toString() )
        })
        Client.getInstance().phaserGame.events.emit( gameEvents.game.DEAD )
        this.lostCargo = {};
    }
/*
    private handleRespawn = () => {
        
    }*/

    private lostCargo : IndexedArray
}