import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gameEvents from "game/helpers/gameEvents"

export default class ExcavationManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "ExcavationManager")
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerMinedCrypto, this.handleMinedCrypto.bind(this))
    }

    private handleMinedCrypto(notification : Protocol.NotifyPlayerMinedCrypto) {
        this.scene.sound.play(`crypto_${notification.cryptoId}`)
        Client.getInstance().phaserGame.events.emit( gameEvents.game.MINEDCRYSTAL, notification.cryptoId);
    }
}