export default class SoundFXManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "SoundFXManager")
        this.volume = 1;
    }

    public setVolume(volume:number) {
        this.volume = volume;
    }
    
    public play(key:string){
        this.scene.sound.play(key, { volume: this.volume } )
    }

    public pause(key:string){
        const targetSound = this.scene.sound.get(key);
        targetSound?.pause();
    }

    public stop(){
        this.scene.sound.stopAll();
    }

    public add(key:string):Phaser.Sound.BaseSound{
        const newSound = this.scene.sound.add(key)
        return newSound
    }

    volume: number
}
