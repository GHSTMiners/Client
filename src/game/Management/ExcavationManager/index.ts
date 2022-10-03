import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gameEvents from "game/helpers/gameEvents"
import MainScene from "game/Scenes/MainScene"

export default class ExcavationManager extends Phaser.GameObjects.GameObject {
    constructor(scene : MainScene) {
        super(scene, "ExcavationManager")
        this.soundFXManager = scene.soundFXManager;
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerMinedCrypto, this.handleMinedCrypto.bind(this))
    }

    private handleMinedCrypto(notification : Protocol.NotifyPlayerMinedCrypto) {
        this.soundFXManager?.playSound(`crypto_${notification.cryptoId}`)
        Client.getInstance().phaserGame.events.emit( gameEvents.game.MINEDCRYSTAL, notification.cryptoId);
    }

    private soundFXManager
}