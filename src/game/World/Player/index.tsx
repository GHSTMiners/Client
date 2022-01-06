import * as Schema from "matchmaking/Schemas";
import * as Phaser from "phaser"

export class Player extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, player: Schema.Player) {
        super(scene, player.x, player.y)
        this.setDepth(3)
        this.playerSchema = player
        this.playerSprite = this.scene.add.sprite(0, 0, 'aavegotchi')
        this.add(this.playerSprite)
        //Create movementtween
        this.movementTween = this.movementTween = this.scene.tweens.add({
            targets: this,
            duration: 1000/50,
            ease: 'Linear',
            delay: 0,
            x:player.x,
            y:player.y,
            paused: false,
            
        });
        //Create particle emitter
        var particles = this.scene.add.particles('dirtParticle');
        particles.setDepth(2);
        this.dirtParticleEmitter = particles.createEmitter({	 
            active: true,
            angle: { min: 247.5, max: 292.5 },
            speed: { min: 800, max: 1000 },
            scale: { start: 1, end: 0 },
            frequency: 12,
            bounce: 0.9,
            gravityY: 2500,
            collideTop: false,
            collideBottom: false,
            lifespan:1500,
            blendMode: 'COLOR',
        });
        this.dirtParticleEmitter.stop();
        this.dirtParticleEmitter.startFollow(this)

        player.onChange = this.stateChanged.bind(this)
    }

    private stateChanged() {  
        // if(this.movementTween) this.scene.tweens.remove(this.movementTween)
        // this.movementTween = this.scene.tweens.add({
        //     targets: this,
        //     duration: 1000/50,
        //     ease: 'Linear',
        //     delay: 0,
        //     x:this.playerSchema.x,
        //     y:this.playerSchema.y,
        //     paused: false,
            
        // });
        this.setPosition(this.playerSchema.x, this.playerSchema.y)
        //Particles while digging
        if(this.playerSchema.playerState != Schema.PlayerState.Drilling && this.dirtParticleEmitter.on) this.dirtParticleEmitter.stop()
        else if (this.playerSchema.playerState == Schema.PlayerState.Drilling && !this.dirtParticleEmitter.on) {
            this.dirtParticleEmitter.start()
            this.scene.cameras.main.shake(20, 0.0015);
        }
        

    }
    private dirtParticleEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    private movementTween : Phaser.Tweens.Tween
    private playerSchema : Schema.Player
    private playerSprite : Phaser.GameObjects.Sprite
}