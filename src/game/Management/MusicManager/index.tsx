import Client from "matchmaking/Client"
import * as APIInterface from "chisel-api-interface"

export default class MusicManager extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "MovementManager")
        this.music = []
        this.currentSong = 0
        Client.getInstance().chiselWorld.music.forEach(music => {
            this.music.push(music)
        })
    }

    public play() {
        if(this.music.length <= 0) return;
        if(this.currentSound) {
            if (!this.currentSound.isPlaying) this.currentSound.play()
        } else {
            console.log(`Now playing: ${this.music[this.currentSong].name}`)
            this.scene.game.events.emit("newSong", this.music[this.currentSong].name );
            this.currentSound = this.scene.sound.add(`music_${this.music[this.currentSong].name}`,
            { 
                loop : false
            });
            this.currentSound.play()
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

    public  currentSongName() : string {
        return this.music[this.currentSong].name;
    }


    private music : APIInterface.Music[]
    private currentSound : Phaser.Sound.BaseSound | undefined
    private currentSong : number
}