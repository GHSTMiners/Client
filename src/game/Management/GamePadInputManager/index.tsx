import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"

export default class GamePadInputManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "GamePadInputManager")
        scene.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, this.attachGamePad.bind(this))
        this.pollTimer = scene.time.addEvent({
            delay: 1000,
            callback: this.pollConnectedGamePads.bind(this),
            loop: true
        })
        this.buttonStates = new Map<ButtonMapping, boolean>()

        /*
        for (let item in Object.values(ButtonMapping)) {
            console.log(ButtonMapping[item])
            // this.buttonStates.set(item, false)
        }
        */
    }

    private attachGamePad(gamepad : Phaser.Input.Gamepad.Gamepad) {
        console.log(`Attached a gamepad to the game ${gamepad}`)
        this.boundGamePad = gamepad
        console.log(this.boundGamePad.axes.at(0)?.pad.axes[0].events)
        this.pollTimer = this.scene.time.addEvent({
            delay: 50,
            callback: this.pollConnectedGamePads.bind(this),
            loop: true
        })
    }

    private pollConnectedGamePads() {
        // Poll connected gamepad
        if (this.scene.input.gamepad.total > 0 && !this.boundGamePad) {
            this.attachGamePad(this.scene.input.gamepad.getPad(0))
        } else if (this.boundGamePad) {
            let directionChangedMessage : Protocol.ChangeDirection = new Protocol.ChangeDirection()
            directionChangedMessage.x = Number(this.boundGamePad.axes.at(0)?.pad.axes[0].getValue())
            directionChangedMessage.y = Number(this.boundGamePad.axes.at(0)?.pad.axes[1].getValue())
            let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(directionChangedMessage)
            Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
            // Class
            for (let index = 0; index < this.boundGamePad.getButtonTotal(); index++) {
                const element = this.boundGamePad.buttons[index]
                if(element.pressed) {
                    console.log(`${index}: ${element.pressed}`)
                }
            }
        }
    }

    private processButtons() {
        // for()
    }

    private pollTimer : Phaser.Time.TimerEvent
    private boundGamePad : Phaser.Input.Gamepad.Gamepad | undefined
    private buttonStates : Map<ButtonMapping, boolean>
}

export enum ButtonMapping {
    A = 0,
    B = 1,
    X = 2, 
    Y = 3, 
    SELECT = 8,
    START = 9,

    DOWN = 13,
    LEFT = 14,
    RIGHT = 15,
    UP = 16,
}