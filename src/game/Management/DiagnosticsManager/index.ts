import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import gameEvents from "game/helpers/gameEvents"

export default class DiagnosticsManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "DiagnosticsManager")
        this.lastLatency = 0
        this.lastPongRequest = new Date()
        Client.getInstance().messageRouter.addRoute(Protocol.Pong, this.handleMessage.bind(this))
        Client.getInstance().phaserGame.events.on( gameEvents.diagnostics.START ,this.startPolling.bind(this))
        Client.getInstance().phaserGame.events.on( gameEvents.diagnostics.STOP ,this.stopPolling.bind(this))
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
        Client.getInstance().phaserGame.events.emit( gameEvents.diagnostics.LATENCY, this.lastLatency)
    }

    static readonly NEW_LATENCY: unique symbol = Symbol();
    private intervalHandle? : NodeJS.Timeout
    public lastLatency : number
    private lastPongRequest : Date
}