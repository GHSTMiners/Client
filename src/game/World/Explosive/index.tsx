import MainScene from "game/Scenes/MainScene";
import * as Schema from "matchmaking/Schemas";


export default class Explosive extends Phaser.GameObjects.Image {
    constructor(scene : MainScene, schema : Schema.Explosive) {
        super(scene, schema.x, schema.y, `explosive_soil_${schema.explosiveID}`)
        this.schema = schema
        this.soundFXManager = scene.soundFXManager;
        this.setDepth(40);
        this.setOrigin(0, 0)
        this.soundFXManager.play('fuse')
    }

    public update(time: number, delta: number) {
        this.setPosition(this.schema.x, this.schema.y)
    }

    public explode() {
        var self = this;
        self.visible = false; // hide bomb as soon as the explosion starts
        this.soundFXManager.play('explosion')
    }

    private soundFXManager
    private schema : Schema.Explosive
}