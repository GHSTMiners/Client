import { Player } from "../Player"
import * as Schema from "matchmaking/Schemas";
import { PlayerState } from "matchmaking/Schemas";


export default class Jackhammer extends Phaser.GameObjects.Container {
    constructor(scene : Phaser.Scene, player: Player) {
        super(scene, 0, 0)
        this.player = player;
        this.jackhammerSpriteRear = this.scene.add.sprite(0, 55, 'jackhammerAnimation')
        this.jackhammerSpriteSide = this.scene.add.sprite(-45, 10, 'jackhammerAnimation')

        this.jackhammerSpriteRear.anims.create({
            key: 'running_rear',
            frames: this.jackhammerSpriteRear.anims.generateFrameNumbers( 'jackhammerAnimation' || '', { start:  0 , end: 4 } ),
            repeat: -1
        });


        this.jackhammerSpriteSide.anims.create({
            key: 'running_side',
            frames: this.jackhammerSpriteSide.anims.generateFrameNumbers( 'jackhammerAnimation' || '', { start:  5 , end: 9 } ),
            repeat: -1
        });

        this.add(this.jackhammerSpriteSide)
        this.add(this.jackhammerSpriteRear)

    }

    process() {
        if(this.player.playerSchema.playerState.movementState == Schema.MovementState.Drilling){
            //Process direction
            switch(this.player.playerSchema.playerState.movementDirection) {
                case Schema.MovementDirection.Left:
                    this.jackhammerSpriteRear.setVisible(false)
                    this.jackhammerSpriteSide.setVisible(true)
                    this.jackhammerSpriteSide.setX(-60)
                    this.jackhammerSpriteSide.setRotation(Math.PI/2)
                    this.jackhammerSpriteSide.flipX = true
                break;
                case Schema.MovementDirection.Right:
                    this.jackhammerSpriteRear.setVisible(false)
                    this.jackhammerSpriteSide.setVisible(true)
                    this.jackhammerSpriteSide.setRotation(-Math.PI/2)
                    this.jackhammerSpriteSide.setX(60)                
                    this.jackhammerSpriteSide.flipX = false
                break;
                default:
                    this.jackhammerSpriteRear.setVisible(true)
                    this.jackhammerSpriteSide.setVisible(false)  
            }
            this.jackhammerSpriteRear.anims.play('running_rear', true)
            this.jackhammerSpriteSide.anims.play('running_side', true)
            console.log(this.player.playerSchema.playerState.movementDirection)
        } else {
            this.jackhammerSpriteRear.setVisible(false)
            this.jackhammerSpriteSide.setVisible(false)  
        }
    }

    protected player : Player 
    protected jackhammerSpriteRear : Phaser.GameObjects.Sprite
    protected jackhammerSpriteSide : Phaser.GameObjects.Sprite

}