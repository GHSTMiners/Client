import * as Schema from "matchmaking/Schemas";


export default class Explosive extends Phaser.GameObjects.Image {
    constructor(scene : Phaser.Scene, schema : Schema.Explosive) {
        super(scene, schema.x, schema.y, `explosive_soil_${schema.explosiveID}`)
        this.schema = schema
        this.setDepth(40);
    }

    public update(time: number, delta: number) {
        this.setPosition(this.schema.x, this.schema.y)
    }

    private schema : Schema.Explosive
}