import Config from "config";
import * as Schema from "matchmaking/Schemas";


export default class Explosive extends Phaser.GameObjects.Image {
    constructor(scene : Phaser.Scene, schema : Schema.Explosive) {
        super(scene, schema.x, schema.y, `explosive_soil_${schema.explosiveID}`)
        this.schema = schema
        this.setDepth(40);
        this.setOrigin(0, 0)
        this.fuseSound = this.scene.sound.add('fuse')
        this.explosiveSound = this.scene.sound.add('explosion')

        this.fuseSound.play()


    }

    public update(time: number, delta: number) {
        this.setPosition(this.schema.x, this.schema.y)
    }

    public explode() {
        var self = this;
        self.visible = false; // hide bomb as soon as the explosion starts
        this.explosiveSound.play();
    }

    private fuseSound : Phaser.Sound.BaseSound
    private explosiveSound : Phaser.Sound.BaseSound
    private schema : Schema.Explosive
}