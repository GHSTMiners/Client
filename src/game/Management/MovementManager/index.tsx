import Client from "matchmaking/Client"

export default class MovementManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "MovementManager")
        this.keys = new Map<number, Phaser.Input.Keyboard.Key>()
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.W, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, true, true))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.S, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, true, true))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.D, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, true))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.A, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, true))
        this.keys.forEach(key => {
            key.on('down', this.keysChanged.bind(this))
            key.on('up', this.keysChanged.bind(this))
        }, this)
    }

    private keysChanged() {
        let directionVector : Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.W)?.isDown) directionVector.y-=1
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.S)?.isDown) directionVector.y+=1
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.D)?.isDown) directionVector.x+=1
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.A)?.isDown) directionVector.x-=1
        Client.getInstance().colyseusRoom.send("direction", JSON.stringify(directionVector))
    }

    private keys : Map<number, Phaser.Input.Keyboard.Key>
}