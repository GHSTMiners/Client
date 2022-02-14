import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"

export default class ExcavationManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "ExcavationManager")
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerMinedCrypto, this.handleMinedCrype.bind(this))
    }

    private handleMinedCrype(notification : Protocol.NotifyPlayerMinedCrypto) {
        this.scene.sound.play(`crypto_${notification.cryptoId}`)
    }
}