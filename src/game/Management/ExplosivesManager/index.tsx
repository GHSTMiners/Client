import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import * as Schema from "matchmaking/Schemas";

export default class ExplosivesManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "ExplosivesManager")
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyBombExploded, this.handleBombExploded.bind(this))
        Client.getInstance().colyseusRoom.state.explosives.onAdd = this.handleBombAdded.bind(this)
    }

    private handleBombAdded(explosive : Schema.Explosive, key : number) {
        this.scene.sound.play(`fuse`)
    }

    private handleBombExploded(notification : Protocol.NotifyBombExploded) {
        this.scene.sound.play(`explosion`, {
            
        })
    }
}