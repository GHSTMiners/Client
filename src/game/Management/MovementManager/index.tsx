import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
export default class MovementManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "MovementManager")
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = new Map<number, Phaser.Input.Keyboard.Key>()
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.DOWN, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.UP, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.LEFT, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.RIGHT, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.W, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.S, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.D, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.A, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.B, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B, true, false))

        this.keys.forEach(key => {
            key.on('down', this.keysChanged.bind(this))
            key.on('up', this.keysChanged.bind(this)) 
        }, this)
    }

    private keysChanged() {
        let directionChangedMessage : Protocol.ChangeDirection = new Protocol.ChangeDirection()
        if(this.cursors.up.isDown || this.keys.get(Phaser.Input.Keyboard.KeyCodes.W)?.isDown) directionChangedMessage.y-=1
        if(this.cursors.down.isDown ||this.keys.get(Phaser.Input.Keyboard.KeyCodes.S)?.isDown) directionChangedMessage.y+=1
        if(this.cursors.right.isDown ||this.keys.get(Phaser.Input.Keyboard.KeyCodes.D)?.isDown) directionChangedMessage.x+=1
        if(this.cursors.left.isDown || this.keys.get(Phaser.Input.Keyboard.KeyCodes.A)?.isDown) directionChangedMessage.x-=1
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.B)?.isDown) {
            let requestDropExplosive : Protocol.RequestDropExplosive = new Protocol.RequestDropExplosive()
            requestDropExplosive.explosiveID = 2
            let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(requestDropExplosive)
            Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
        } else {
            let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(directionChangedMessage)
            Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
        }
    }
 
    public velocityVector () : Phaser.Math.Vector2 {
        var velocityVector : Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)
        if(this.cursors.left.isDown || this.keys.get(Phaser.Input.Keyboard.KeyCodes.A)?.isDown) velocityVector.x -= 1
        if(this.cursors.right.isDown || this.keys.get(Phaser.Input.Keyboard.KeyCodes.D)?.isDown) velocityVector.x += 1
        if(this.cursors.up.isDown || this.keys.get(Phaser.Input.Keyboard.KeyCodes.W)?.isDown) velocityVector.y -= 1
        if(this.cursors.down.isDown || this.keys.get(Phaser.Input.Keyboard.KeyCodes.S)?.isDown) velocityVector.y += 1       
        return velocityVector;
    }

    private keys : Map<number, Phaser.Input.Keyboard.Key>
    private cursors :Phaser.Types.Input.Keyboard.CursorKeys
}