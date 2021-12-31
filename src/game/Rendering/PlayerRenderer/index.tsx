import { Player } from "game/World/Player";
import Client from "matchmaking/Client";
import * as Schema from "matchmaking/Schemas";

export default class PlayerRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "PlayerRenderer")
        this.playerSprites = new Map<number, Player>()
        //Handle player creation
        Client.getInstance().colyseusRoom.state.players.onAdd = this.addPlayerSprite.bind(this)
        Client.getInstance().colyseusRoom.state.players.onRemove = this.removePlayerSprite.bind(this)
        Client.getInstance().colyseusRoom.state.players.forEach(player => {
            this.addPlayerSprite(player)
        }, this)
    }

    private addPlayerSprite(player : Schema.Player ) {
        console.log(`Player entered the game with Aavegotchi ID: ${player.gotchiID}`)
        let newPlayer : Player = new Player(this.scene, player)
        this.playerSprites.set(player.gotchiID, newPlayer)
        this.scene.add.existing(newPlayer)
        //Check if this sprite belong to me
        console.log(`${player.playerSessionID}, ${Client.getInstance().colyseusRoom.sessionId}`)
        if(player.playerSessionID == Client.getInstance().colyseusRoom.sessionId) {
            this.scene.cameras.main.startFollow(newPlayer)
        }
    }

    private removePlayerSprite(player : Schema.Player) {
        console.log(`Player left the game with Aavegotchi ID: ${player.gotchiID}`)
        let playerSprite : Player | undefined = this.playerSprites.get(player.gotchiID)
        if(playerSprite) {
            this.playerSprites.delete(player.gotchiID)
            playerSprite.destroy()
        }
    }

    private playerSprites : Map<number, Player> 
}
