import Config from "config";

export class RefineAnimation extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, cryptoID : string ) {
        super(scene, 0, 0);

        this.setSize( Config.blockWidth, Config.blockHeight )
        this.setDepth(30)
        
        //Create particle emitter
        var flareParticles = this.scene.add.particles(`crypto_wallet_${cryptoID}`);
        flareParticles.setDepth(30);
        this.flareParticleEmitter = flareParticles.createEmitter({
            x: 400,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 180, max: 360 },
            scale: { start: 0.2, end: 0 },
            blendMode: 'COLOR',
            active: true,
            lifespan: 600,
            gravityY: 800
        });
        this.flareParticleEmitter.startFollow(this);
        
        this.scene.physics.add.existing(this, false)

        this.setPosition(  27.3* Config.blockWidth , -Config.blockHeight *4  )
        
        this.timer  = new Phaser.Time.TimerEvent({
            delay: 900 ,
            callback: () => { this.flareParticleEmitter.stop(); this.destroy() } , 
            callbackScope: this,
            loop: false,
          });
        this.scene.time.addEvent(this.timer)
    }

    private timer
    private flareParticleEmitter
}
