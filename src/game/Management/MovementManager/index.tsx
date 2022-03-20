import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
export default class MovementManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "MovementManager")
        this.keys = new Map<number, Phaser.Input.Keyboard.Key>()
        this.addAllKeys();
        this.setGameMode();
        // Adding event related actions to open/close the chat with a mouse click
        this.scene.game.events.on("open_chat",  ()=>{this.setChatMode()} );
        this.scene.game.events.on("close_chat", ()=>{this.setGameMode()} );
    }

    private addAllKeys=()=>{
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.DOWN, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.UP, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.LEFT, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.RIGHT, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.W, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.S, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.D, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.A, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.B, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.R, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.ONE, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.TWO, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.THREE, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.FOUR, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.ESC, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true, false))
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.T, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T, true, false))
        // remove SPACE blockage (set by default)
        this.scene.input.keyboard.removeCapture('SPACE'); 
    }

    private setGameMode=()=>{
        this.clearKeys();
        this.enableGameKeys();
        this.keys.forEach(key => {
            key.on('down', ()=>{this.keysChangedGaming()})
            key.on('up', ()=>{this.keysChangedGaming()}) 
        }, this)
    }

    private setChatMode=()=>{
        this.clearKeys();
        this.scene.input.keyboard.addCapture(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.keys.set(Phaser.Input.Keyboard.KeyCodes.ESC, this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC, true, false) );
        this.keys.forEach(key => {
            key.on('down', ()=>{this.keysChangedChatting()} )
            key.on('up', ()=>{this.keysChangedChatting()}) 
        }, this)
    }

    private enableGameKeys=()=>{
        this.clearKeys();
        this.keys.forEach( key => {
            this.scene.input.keyboard.addCapture(key.keyCode)
            this.keys.set( key.keyCode , this.scene.input.keyboard.addKey(key.keyCode, true, false) ) 
        });        
    }

    private clearKeys=()=>{
        // remove all keys' callbacks
        this.keys.forEach( key =>  this.scene.input.keyboard.removeKey(key.keyCode) );
        // remove key events being routed to phaser, unblocking its usage
        this.keys.forEach( key =>  this.scene.input.keyboard.removeCapture(key.keyCode) );
    }

    private keysChangedGaming() {
        let directionChangedMessage : Protocol.ChangeDirection = new Protocol.ChangeDirection()
        if( (this.keys.get(Phaser.Input.Keyboard.KeyCodes.UP)?.isDown) || this.keys.get(Phaser.Input.Keyboard.KeyCodes.W)?.isDown) directionChangedMessage.y-=1
        if( (this.keys.get(Phaser.Input.Keyboard.KeyCodes.DOWN)?.isDown) ||this.keys.get(Phaser.Input.Keyboard.KeyCodes.S)?.isDown) directionChangedMessage.y+=1
        if( (this.keys.get(Phaser.Input.Keyboard.KeyCodes.RIGHT)?.isDown) ||this.keys.get(Phaser.Input.Keyboard.KeyCodes.D)?.isDown) directionChangedMessage.x+=1
        if( (this.keys.get(Phaser.Input.Keyboard.KeyCodes.LEFT)?.isDown) || this.keys.get(Phaser.Input.Keyboard.KeyCodes.A)?.isDown) directionChangedMessage.x-=1

        if (directionChangedMessage){    
            let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(directionChangedMessage)
            Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)
        }
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.ONE)?.isDown) {
            this.scene.game.events.emit("shortcut",1)
        }
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.TWO)?.isDown) {
            this.scene.game.events.emit("shortcut",2)
        }
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.THREE)?.isDown) {
            this.scene.game.events.emit("shortcut",3)
        }
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.FOUR)?.isDown) {
            this.scene.game.events.emit("shortcut",4)
        }
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.ESC)?.isDown) {
            this.scene.game.events.emit("close_dialogs")
        }
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.R)?.isDown) {
            this.scene.game.events.emit("open_exchange")
        }
        // Change event handlers when the game goes into chat mode
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.T)?.isDown) {
            this.scene.game.events.emit("open_chat")
        }
    }

    private keysChangedChatting() {
        if(this.keys.get(Phaser.Input.Keyboard.KeyCodes.ESC)?.isDown) {
            this.scene.game.events.emit("close_chat")
        }        
    }
 
    public velocityVector () : Phaser.Math.Vector2 {
        var velocityVector : Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0)
        if( (this.keys.get(Phaser.Input.Keyboard.KeyCodes.LEFT)?.isDown)  || this.keys.get(Phaser.Input.Keyboard.KeyCodes.A)?.isDown) velocityVector.x -= 1
        if( (this.keys.get(Phaser.Input.Keyboard.KeyCodes.RIGHT)?.isDown)  || this.keys.get(Phaser.Input.Keyboard.KeyCodes.D)?.isDown) velocityVector.x += 1
        if( (this.keys.get(Phaser.Input.Keyboard.KeyCodes.UP)?.isDown)  || this.keys.get(Phaser.Input.Keyboard.KeyCodes.W)?.isDown) velocityVector.y -= 1
        if( (this.keys.get(Phaser.Input.Keyboard.KeyCodes.DOWN)?.isDown)  || this.keys.get(Phaser.Input.Keyboard.KeyCodes.S)?.isDown) velocityVector.y += 1       
             
        return velocityVector;
    }

    private keys : Map<number, Phaser.Input.Keyboard.Key>
}