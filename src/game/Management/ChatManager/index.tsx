import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"

export default class ChatManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "ChatManager")
        Client.getInstance().messageRouter.addRoute(Protocol.MessageFromServer, this.handleMessage.bind(this))
        
    }

    private handleMessage(notification : Protocol.MessageFromServer) {
        if (notification.systemMessage) {
            Client.getInstance().phaserGame.events.emit('system_message', notification)
        } else {
            Client.getInstance().phaserGame.events.emit('chat_message', notification)
        } 
    }
}