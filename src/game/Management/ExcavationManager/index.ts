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

    private handleMinedCrypto(message : Protocol.NotifyPlayerMinedCrypto) {
        if (message.gotchiId === Client.getInstance().ownPlayer.gotchiID){
            this.soundFXManager.play(`crypto_${message.cryptoId}`)
            Client.getInstance().phaserGame.events.emit( gameEvents.game.MINEDCRYSTAL, message.cryptoId);
        }
    }

    private soundFXManager
}