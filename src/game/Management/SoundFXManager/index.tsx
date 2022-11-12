import Config from "config";
import { useGlobalStore } from "store";

export default class SoundFXManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "SoundFXManager")
        this.volume = 1;
        this.gain = 1;
    }

    public setVolume(volume:number) {
        this.volume = volume;
    }
    
    public play(key:string){
        this.scene.sound.play(key, { volume: this.volume } )
    }

    private calculateGain(x:number,y:number){
        const x0 = useGlobalStore.getState().playerState.x;
        const y0 = useGlobalStore.getState().playerState.y;
        const offset = 10 ; // the bigger, the smoother the decay with distance
        const distance = Math.sqrt( Math.pow(x-x0,2) + Math.pow(y-y0,2) ) / Config.blockWidth;
        const gain = offset / ( offset + Math.pow(distance,2) )
        return gain
    }

    public playAtLocation( sound:Phaser.Sound.BaseSound, x:number, y:number ){
        this.gain = this.calculateGain(x,y);
        sound.play( { volume: this.volume * this.gain } )
    }

    public updateLocation( sound:Phaser.Sound.BaseSound, x:number, y:number){
        this.gain = this.calculateGain(x,y);
        sound.isPlaying?
        (sound as Phaser.Sound.HTML5AudioSound).setVolume( this.volume * this.gain ):
        sound.play( { volume: this.volume * this.gain } );        
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

    private gain: number
    public volume: number
}
