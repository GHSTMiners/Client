import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gameEvents from "game/helpers/gameEvents"
import MainScene from "game/Scenes/MainScene";

export default class LifeCycleManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "ExcavationManager")
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyGameStarted, this.handleGameStarted.bind(this))
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyGameEnded, this.handleGameEnded.bind(this))
    }

    handleGameStarted(){
        console.log('Game just started!')
      }
    
    handleGameEnded(){
      (this.scene as MainScene).musicManager?.stop();
      (this.scene as MainScene).soundFXManager?.stop();
      Client.getInstance().phaserGame.events.emit( gameEvents.game.END,  { 
        roomId: Client.getInstance().colyseusRoom.id , 
        gotchiId: `${Client.getInstance().ownPlayer.gotchiID}` } );
    }
}