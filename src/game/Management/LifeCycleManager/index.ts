import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gameEvents from "game/helpers/gameEvents"
import MainScene from "game/Scenes/MainScene";
import { useGlobalStore } from "store";

export default class LifeCycleManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "LifeCyleManager")
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyGameStarted, this.handleGameStarted.bind(this))
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyGameEnded, this.handleGameEnded.bind(this))        
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyPlayerLeftGame, this.handlePlayerLeftGame.bind(this))
        //Client.getInstance().colyseusRoom.onLeave(this.handleGameEnded.bind(this))
    }

    handleGameStarted(){
        console.log('Game just started!')
      }

    public requestLeave() {
      let leaveRequest : Protocol.RequestLeaveGame = new Protocol.RequestLeaveGame()
      const message = Protocol.MessageSerializer.serialize(leaveRequest)
      Client.getInstance().colyseusRoom.send(message.name, message.data)
    }

    public handlePlayerLeftGame(message: Protocol.NotifyPlayerLeftGame ){
      if (message.gotchiId === Client.getInstance().ownPlayer?.gotchiID){
        this.handleGameEnded();
      }
    }
    
    public handleGameEnded(){
      console.log('My player left the room, my game is over');
      (this.scene as MainScene).shutdown();
      useGlobalStore.getState().clearUserGameData();

      Client.getInstance().phaserGame.events.emit( gameEvents.game.END,  { 
        roomId: Client.getInstance().colyseusRoom.id , 
        gotchiId: `${Client.getInstance().ownPlayer.gotchiID}` } );
    }
}