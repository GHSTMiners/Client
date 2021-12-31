import * as Schema from "matchmaking/Schemas";
import * as Phaser from "phaser"

export class Player extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, player: Schema.Player) {
        super(scene, player.x, player.y)
        this.playerSchema = player
        this.playerSprite = this.scene.add.sprite(0, 0, 'aavegotchi')
        this.add(this.playerSprite)
        //Create movementtween
        this.movementTween = this.scene.tweens.add({
            targets: this,
            duration: 1000/50,
            ease: 'Linear',
            delay: 0,
            x:0,
            y:0,
            paused: false,
            
        });
        player.onChange = this.locationChanged.bind(this)
    }

    private locationChanged() {        
        this.movementTween = this.scene.tweens.add({
            targets: this,
            duration: 1000/50,
            ease: 'Linear',
            delay: 0,
            x:this.playerSchema.x,
            y:this.playerSchema.y,
            paused: false,
            
        });
    }

    private movementTween : Phaser.Tweens.Tween
    private playerSchema : Schema.Player
    private playerSprite : Phaser.GameObjects.Sprite
}