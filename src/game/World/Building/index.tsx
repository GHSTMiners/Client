import * as APIInterface from "chisel-api-interface"
import Config from "config";

export default class Builing extends Phaser.GameObjects.Video {
    constructor(building : APIInterface.Building, scene : Phaser.Scene) {
        super(scene, Config.blockWidth * building.spawn_x, Config.blockHeight * building.spawn_y, `building_${building.id}`)
        this.buildingInfo = building
        scene.add.existing(this)
        this.setDepth(20)
        //this.play(true)
        this.setCurrentTime('+2')
        this.setOrigin(0, 1)
        this.scene.physics.add.existing(this);
    }

    process(): void {
        /*
        const cameraRect = this.scene.cameras.main.worldView
        if (!this.isPaused() && !this.scene.cameras.main.worldView.contains(this.scene.cameras.main.worldView.centerX, this.y)) {
            this.setPaused(true)
        } else if (this.isPaused() && this.scene.cameras.main.worldView.contains(this.scene.cameras.main.worldView.centerX, this.y)) {
            this.setPaused(false)
        }
        */
        
    }
    public readonly buildingInfo : APIInterface.Building
}