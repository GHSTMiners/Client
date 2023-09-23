import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import { IndexedArray } from "types"
import gameEvents from "game/helpers/gameEvents";
import { Crystal } from "game/World/Crystal";

export default class RespawnManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "RespawnManager")
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerDied, this.handleDead.bind(this))
        //Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerRespawned, this.handleRespawn.bind(this))
    }

    private handleDead = ( message: Protocol.NotifyPlayerDied ) => {
        Client.getInstance().phaserGame.events.emit( gameEvents.chat.PLAYERDEAD , message )
        const lostCargo : IndexedArray = {};
        const deadPlayer = Client.getInstance().colyseusRoom.state.players.find( player => player.gotchiID === message.gotchiId)
        try{
            deadPlayer?.cargo.forEach( entry => {
                lostCargo[entry.cryptoID] = entry.amount
                for (let i = 0; i < entry.amount; i++) new Crystal(this.scene, message.gotchiId, entry.cryptoID.toString() )
        })} catch (err) {
            console.log(err)
        }
        Client.getInstance().phaserGame.events.emit( gameEvents.game.DEAD , message )
    }
}