import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
export default class MovementManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "MovementManager")
        this.keys = new Map<number, Phaser.Input.Keyboard.Key>()
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.W, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.S, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.D, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.A, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, false))
        this.keys.forEach(key => {
            key.on('down', this.keysChanged.bind(this))
            key.on('up', this.keysChanged.bind(this))
        }, this)
    }

    private keysChanged() {
        let directionChangedMessage : Protocol.ChangeDirection = new Protocol.ChangeDirection()
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.W)?.isDown) directionChangedMessage.y-=1
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.S)?.isDown) directionChangedMessage.y+=1
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.D)?.isDown) directionChangedMessage.x+=1
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.A)?.isDown) directionChangedMessage.x-=1
        let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(directionChangedMessage)
        Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
    }

    private keys : Map<number, Phaser.Input.Keyboard.Key>
}