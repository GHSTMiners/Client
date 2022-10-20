import Config from "config";

export class RefineAnimation extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, cryptoID : string ) {
        super(scene, 0, 0);

        this.setSize( Config.blockWidth, Config.blockHeight )
        this.setDepth(30)
        
        //Create particle emitter
        var coinParticles = this.scene.add.particles(`crypto_wallet_${cryptoID}`);
        coinParticles.setDepth(30);
        this.coinParticleEmitter = coinParticles.createEmitter({
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

        //Link to container and add to the scene
        this.coinParticleEmitter.startFollow(this);
        this.scene.physics.add.existing(this, false)

        //Set position above the refinery
        this.setPosition(  27.3* Config.blockWidth , -Config.blockHeight *4  )
        
        //Creating timers to stop the particle emitter and then destroy the objects 
        var stopTimer  = new Phaser.Time.TimerEvent({
            delay: 900 ,
            callback: () => { this.coinParticleEmitter.stop() } , 
            callbackScope: this,
            loop: false,
          });

        var destroyTimer  = new Phaser.Time.TimerEvent({
            delay: 1500 ,
            callback: () => { 
                coinParticles.destroy()
                this.destroy() 
            } , 
            callbackScope: this,
            loop: false,
          });

        //Add the timers to the scene
        this.scene.time.addEvent(stopTimer)
        this.scene.time.addEvent(destroyTimer)
    }

    private coinParticleEmitter
}
