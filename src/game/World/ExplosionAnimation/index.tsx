import Config from "config";

export class ExplosionAnimation extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, blockX : number, blockY : number) {
        super(scene, Config.blockWidth * blockX, Config.blockHeight * blockY, "boom")
        this.setOrigin(0, 0)
        this.setDepth(60)
        this.setPosition(Config.blockWidth * blockX, Config.blockHeight * blockY)
        this.anims.create({
            key: 'boom',
            frames: this.anims.generateFrameNumbers("explosionAnimation" || '', { start: 0, end: 15 }),
            hideOnComplete: true,
        })
        this.anims.play("boom");
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationEnded.bind(this) )
    }

    private animationEnded() {
        this.destroy()
    }
}
