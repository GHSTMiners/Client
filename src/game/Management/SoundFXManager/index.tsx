export default class SoundFXManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "SoundFXManager")
        this.volume = 1;
    }

    public setVolume(volume:number) {
        this.volume = volume;
    }
    
    public playSound(key:string){
        this.scene.sound.play(key, { volume: this.volume } )
    }

    volume: number
}
