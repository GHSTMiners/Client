import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"

export default class DiagnosticsManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "DiagnosticsManager")
        this.lastLatency = 0
        this.lastPongRequest = new Date()
        Client.getInstance().messageRouter.addRoute(Protocol.Pong, this.handleMessage.bind(this))
    }

    public requestPong() {
        this.lastPongRequest = new Date()
        let pingMessage : Protocol.Ping = new Protocol.Ping()
        let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(pingMessage)
        Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
    }

    public startPolling() {
        this.intervalHandle = setInterval(this.requestPong, 1000)
    }

    public stopPolling() {
        if(this.intervalHandle) clearInterval(this.intervalHandle)
    }

    private handleMessage(notification : Protocol.Pong) {
        this.lastLatency = (new Date()).getTime() - this.lastPongRequest.getTime()
        this.emit(DiagnosticsManager.NEW_LATENCY, this.lastLatency)
    }

    static readonly NEW_LATENCY: unique symbol = Symbol();
    private intervalHandle? : NodeJS.Timeout
    public lastLatency : number
    private lastPongRequest : Date
}