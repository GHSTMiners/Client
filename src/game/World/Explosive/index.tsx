import Config from "config";
import { Howl } from "howler";
import * as Schema from "matchmaking/Schemas";


export default class Explosive extends Phaser.GameObjects.Image {
    constructor(scene : Phaser.Scene, schema : Schema.Explosive) {
        super(scene, schema.x, schema.y, `explosive_soil_${schema.explosiveID}`)
        this.schema = schema
        this.setDepth(40);
        this.setOrigin(0, 0)
        this.fuseSound = new Howl({
            src: ['assets/audio/fuse.wav'],
            volume: 1,
            preload: true
            
        })
        this.fuseSound.pannerAttr({
            coneInnerAngle: 360,
            coneOuterAngle: 360,
            coneOuterGain: 1,
            maxDistance: Config.blockWidth * 8,
            refDistance: 1,
            distanceModel: 'linear',
            rolloffFactor: 1,
            panningModel: 'HRTF'
        })
        this.fuseSound.play()

        this.explosiveSound = new Howl({
            src: 'assets/audio/explosion.mp3',
            volume: 1,
            preload: true
        })
    }

    public update(time: number, delta: number) {
        this.setPosition(this.schema.x, this.schema.y)
        this.fuseSound.pos(this.schema.x, this.schema.y, 0)
        this.explosiveSound.pos(this.schema.x, this.schema.y, 0)
        this.explosiveSound.pos(this.schema.x, this.schema.y, 0)

    }

    public explode() {
        var self = this;
        this.explosiveSound.pannerAttr({
            coneInnerAngle: 360,
            coneOuterAngle: 360,
            coneOuterGain: 1,
            maxDistance: Config.blockWidth * 20,
            refDistance: 1,
            distanceModel: 'linear',
            rolloffFactor: 1,
            panningModel: 'HRTF'
        })
        this.explosiveSound.play()
        this.explosiveSound.on('end', () => {
            self.destroy()
        })
    }

    private fuseSound : Howl
    private explosiveSound : Howl
    private schema : Schema.Explosive
}