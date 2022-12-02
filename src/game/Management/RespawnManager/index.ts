import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import { IndexedArray } from "types"
import gameEvents from "game/helpers/gameEvents";
import { Crystal } from "game/World/Crystal";
import { useGlobalStore } from "store";

export default class RespawnManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "RespawnManager")
        this.lostCargo = {};
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerDied, this.handleDead.bind(this))
        //Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerRespawned, this.handleRespawn.bind(this))
    }

    private handleDead = (message: Protocol.NotifyPlayerDied) => {
        const players= useGlobalStore.getState().players;
        //const deadPlayerColor = players[message.gotchiId].chatColor;
        //const gotchiDied = `Player 💀<span style={{color: ${deadPlayerColor}}}>${players[message.gotchiId].name}</span> died because ${message.reason} ${message.perpetratorGotchiId? `killed by 😈${players[message.perpetratorGotchiId].name}` : ''} ${message.lostCargo? `loosing ${message.lostCargo} crystals`:''} `
        const gotchiDied = `Player 💀${players[message.gotchiId].name} died because ${message.reason} ${message.perpetratorGotchiId? `killed by 😈${players[message.perpetratorGotchiId].name}` : ''} ${message.lostCargo? `loosing ${message.lostCargo} crystals`:''} `
        const notification = new Protocol.MessageFromServer();
        notification.msg = gotchiDied;
        console.log(gotchiDied)
        Client.getInstance().phaserGame.events.emit( gameEvents.chat.ANNOUNCEMENT , notification)
        if (message.gotchiId === Client.getInstance().ownPlayer?.gotchiID){
            Client.getInstance().ownPlayer?.cargo.forEach( entry => {
                this.lostCargo[entry.cryptoID] = entry.amount
                for (let i = 0; i < entry.amount; i++) new Crystal(this.scene, entry.cryptoID.toString() )
            })
            Client.getInstance().phaserGame.events.emit( gameEvents.game.DEAD )
            this.lostCargo = {};
        }
    }
/*
    private handleRespawn = () => {
        
    }*/

    private lostCargo : IndexedArray
}