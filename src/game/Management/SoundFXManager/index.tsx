import Config from "config";
import { useGlobalStore } from "store";

export default class SoundFXManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "SoundFXManager")
    }

    public setVolume(volume:number) {
        useGlobalStore.getState().setSoundFXVolume(volume);
    }

    public getVolume(){
        return useGlobalStore.getState().soundFXVolume ;
    }
    
    public play(key:string){
        this.scene.sound.play(key, { volume: useGlobalStore.getState().soundFXVolume } )
    }

    private calculateGain(x:number,y:number){
        const x0 = useGlobalStore.getState().playerState.x;
        const y0 = useGlobalStore.getState().playerState.y;
        const offset = 10 ; // the bigger, the smoother the decay with distance
        const distance = Math.sqrt( Math.pow(x-x0,2) + Math.pow(y-y0,2) ) / Config.blockWidth;
        const gain = offset / ( offset + Math.pow(distance,2) )
        return gain
    }

    private calculatePan(x:number,y:number){
        const x0 = useGlobalStore.getState().playerState.x;
        const maxBlocks = 10; 
        const distanceX = (1/maxBlocks) * (x-x0) / Config.blockWidth;
        const pan = Math.abs(distanceX)>1 ? Math.sign(distanceX) : distanceX;
        return pan
    }

    public playAtLocation( sound:Phaser.Sound.BaseSound, x:number, y:number){
        const gain = this.calculateGain(x,y);
        const pan = this.calculatePan(x,y);
        sound.isPlaying?
        (sound as Phaser.Sound.HTML5AudioSound).setVolume( useGlobalStore.getState().soundFXVolume * gain ):
        sound.play( { volume: useGlobalStore.getState().soundFXVolume * gain } );
        (sound as Phaser.Sound.HTML5AudioSound).setPan( pan );
    }

    public pause(key:string){
        const targetSound = this.scene.sound.get(key);
        targetSound?.pause();
    }

    public stop(){
        this.scene?.sound?.stopAll();
    }

    public add(key:string):Phaser.Sound.BaseSound{
        const newSound = this.scene.sound.add(key)
        return newSound
    }
}
