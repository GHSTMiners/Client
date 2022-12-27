import Client from "matchmaking/Client"
import * as APIInterface from "chisel-api-interface"
import { useGlobalStore } from "store"

export default class MusicManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "MusicManager")
        this.music = []
        this.currentSong = 0
        Client.getInstance().chiselWorld.music.forEach(music => {
            this.music.push(music)
        })
        this.play();
    }

    public play() {
        if(this.music.length <= 0) return;
        if(this.currentSound) {
            if (!this.currentSound.isPlaying) this.currentSound.play()
        } else {
            this.currentSound = this.scene.sound.add(`music_${this.music[this.currentSong].name}`,
            { 
                loop : false
            });
            this.currentSound.play( {volume: useGlobalStore.getState().musicVolume } )
            this.currentSound.once(Phaser.Sound.Events.COMPLETE, this.next.bind(this))
        }
    }

    public next() {
        this.currentSong += 1
        if(this.currentSong >= this.music.length) this.currentSong = 0;
        if(this.currentSound) {
            this.currentSound?.destroy();
            this.currentSound = undefined
        }
        this.play()
    }

    public previous() {
        this.currentSong -= 1
        if(this.currentSong < 0) this.currentSong = this.music.length -1;
        if(this.currentSound) {
            this.currentSound?.destroy();
            this.currentSound = undefined
        }
        this.play()
    }

    public stop() {
        try{
            this.currentSound?.destroy();
            this.currentSound = undefined
        } catch (err){
            console.log(err)
        }   
    }

    public shutdown() {
        this.stop();
        this.music = []
        this.currentSong = 0
    }

    public  currentSongName() : string {
        return this.music[this.currentSong].name;
    }

    public setVolume(newVolume:number) {
        useGlobalStore.getState().setMusicVolume(newVolume);
        (this.currentSound as Phaser.Sound.HTML5AudioSound).setVolume(newVolume);
    }

    public getVolume() {
        return useGlobalStore.getState().musicVolume;
    }

    private music : APIInterface.Music[]
    private currentSound : Phaser.Sound.BaseSound | undefined
    private currentSong : number
}