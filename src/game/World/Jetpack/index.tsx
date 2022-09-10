import { Player } from "../Player"
import * as Schema from "matchmaking/Schemas";

export default class Jetpack extends Phaser.GameObjects.Container {
    constructor(scene : Phaser.Scene, player: Player) {
        super(scene, 0, 0)
        this.player = player;
        this.jetpackSpriteRear = this.scene.add.sprite(0, 0, 'jetpackAnimationRear')
        this.jetpackSpriteSide = this.scene.add.sprite(-45, 0, 'jetpackAnimationSide')

        this.jetpackSpriteRear.setScale(0.40)
        this.jetpackSpriteSide.setScale(0.45)

        this.thrusterSound = this.scene.sound.add('thrusters');


        this.jetpackSpriteRear.anims.create({
            key: 'idle_rear',
            frames: this.jetpackSpriteRear.anims.generateFrameNumbers( 'jetpackAnimationRear' || '', { start:  0 , end: 0 } ),
        });

        this.jetpackSpriteRear.anims.create({
            key: 'running_rear',
            frames: this.jetpackSpriteRear.anims.generateFrameNumbers( 'jetpackAnimationRear' || '', { start:  0 , end: 24 } ),
            repeat: -1
        });

        this.jetpackSpriteSide.anims.create({
            key: 'idle_side',
            frames: this.jetpackSpriteSide.anims.generateFrameNumbers( 'jetpackAnimationSide' || '', { start:  0 , end: 0 } ),
            repeat: -1
        });

        this.jetpackSpriteSide.anims.create({
            key: 'running_side',
            frames: this.jetpackSpriteSide.anims.generateFrameNumbers( 'jetpackAnimationSide' || '', { start:  0 , end: 24 } ),
            repeat: -1
        });

        this.add(this.jetpackSpriteSide)
        this.add(this.jetpackSpriteRear)

    }

    process() {
        //Process direction
        switch(this.player.playerSchema.playerState.movementDirection) {
            case Schema.MovementDirection.Left:
                this.jetpackSpriteRear.setVisible(false)
                this.jetpackSpriteSide.setVisible(true)
                this.jetpackSpriteSide.setX(45)
                this.jetpackSpriteSide.flipX = true
            break;
            case Schema.MovementDirection.Right:
                this.jetpackSpriteRear.setVisible(false)
                this.jetpackSpriteSide.setVisible(true)
                this.jetpackSpriteSide.setX(-45)
                this.jetpackSpriteSide.flipX = false
            break;
            default:
                this.jetpackSpriteRear.setVisible(true)
                this.jetpackSpriteSide.setVisible(false)  
        }
        //Process animation
        let flying : boolean = this.player.playerSchema.playerState.movementState === Schema.MovementState.Flying
        if(flying) {
            this.jetpackSpriteRear.anims.play('running_rear', true)
            this.jetpackSpriteSide.anims.play('running_side', true)
        } else {
            this.jetpackSpriteRear.anims.play('idle_rear', true)
            this.jetpackSpriteSide.anims.play('idle_side', true)
        }

        //Process sound
        
        if(this.thrusterSound.isPlaying !== flying) {
            flying ? this.thrusterSound.play() : this.thrusterSound.pause()
        }
    }

    protected player : Player 
    protected thrusterSound : Phaser.Sound.BaseSound
    protected jetpackSpriteRear : Phaser.GameObjects.Sprite
    protected jetpackSpriteSide : Phaser.GameObjects.Sprite

}