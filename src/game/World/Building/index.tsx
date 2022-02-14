import * as APIInterface from "chisel-api-interface"
import Config from "config";

export default class Builing extends Phaser.GameObjects.Video {
    constructor(building : APIInterface.Building, scene : Phaser.Scene) {
        super(scene, Config.blockWidth * building.spawn_x, Config.blockHeight * building.spawn_y, `building_${building.id}`)
        this.buildingInfo = building
        scene.add.existing(this)
        this.setDepth(20)
        this.play(true)
        this.setOrigin(0, 1)
        this.scene.physics.add.existing(this);
    }
    public readonly buildingInfo : APIInterface.Building
}