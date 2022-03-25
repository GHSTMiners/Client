import { Player } from "../Player"
import * as Schema from "matchmaking/Schemas";
import { PlayerState } from "matchmaking/Schemas";


export default class Jetpack extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene, player: Player) {
        super(scene, 'Jetpack')
        this.player = player;
        this.jetpackSprite = this.scene.add.sprite(0, 0, 'jetpackAnimation')
        this.jetpackSprite.setDepth(this.player.playerSprite.depth+1)
        this.jetpackSprite.setScale(0.5)

        this.jetpackSprite.anims.create({
            key: 'idle',
            frames: this.jetpackSprite.anims.generateFrameNumbers( 'jetpackAnimation' || '', { start:  0 , end: 24 } ),
        });
    }


    update() { 
        let playerState: PlayerState = this.player.playerSchema.playerState;
        
        this.jetpackSprite.setPosition(this.player.playerSprite.x, this.player.playerSprite.y+50)

        //Handle flying
        if( playerState.movementState == Schema.MovementState.Flying ) {
            this.jetpackSprite.anims.play('idle', true)
        }
        else {
            //this.jetpackSprite.stop();
            //this.jetpackSprite.setTexture("jetpackAnimation", 0)
        }
        
    }

    protected player: Player 
    protected jetpackSprite : Phaser.GameObjects.Sprite
}