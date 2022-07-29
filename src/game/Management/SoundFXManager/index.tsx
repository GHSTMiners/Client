export default class SoundFXManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "SoundFXManager")

        this.scene.game.events.on("LowFuelWarning", this.playLowFuel.bind(this) );
    }

    public playLowFuel (){
        this.scene.sound.play('lowFuelWarning')
    }
}
