import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"

export default class DiagnosticsManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "DiagnosticsManager")
        this.lastLatency = 0
        this.lastPongRequest = new Date()
        Client.getInstance().messageRouter.addRoute(Protocol.Pong, this.handleMessage.bind(this))
        Client.getInstance().phaserGame.events.on('start_polling',this.startPolling.bind(this))
        Client.getInstance().phaserGame.events.on('stop_polling',this.stopPolling.bind(this))
    }

    public requestPong() {
        this.lastPongRequest = new Date()
        let pingMessage : Protocol.Ping = new Protocol.Ping()
        let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(pingMessage)
        Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
    }

    public startPolling() {
        this.intervalHandle = setInterval(this.requestPong, 5000)
    }

    public stopPolling() {
        if(this.intervalHandle) clearInterval(this.intervalHandle)
    }

    private handleMessage(notification : Protocol.Pong) {
        this.lastLatency = (new Date()).getTime() - this.lastPongRequest.getTime() 
        Client.getInstance().phaserGame.events.emit('new_latency', this.lastLatency)
        //this.emit(DiagnosticsManager.NEW_LATENCY, this.lastLatency) // issues accessing the class symbol state before initiating the class, to be changed when REDUX is implemented
    }

    static readonly NEW_LATENCY: unique symbol = Symbol();
    private intervalHandle? : NodeJS.Timeout
    public lastLatency : number
    private lastPongRequest : Date
}