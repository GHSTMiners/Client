import Config from "config"
import * as APIInterface from "chisel-api-interface"
import Client from "matchmaking/Client"

export default class BackgroundRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "BlockRenderer")
        this.backgrounds = new Map<APIInterface.Background, Phaser.GameObjects.Image>()
        this.loadBackgrounds()
    }

    private loadBackgrounds() {
        var self = this;
        Client.getInstance().chiselWorld.backgrounds.forEach(background => {
            let newBackgroundImage : Phaser.GameObjects.Image = this.scene.add.image(0, this.layerToYCoordinate(background.starting_layer), `background_${background.id}`)
            newBackgroundImage.setOrigin(0, 1)
            self.backgrounds.set(background, newBackgroundImage)
        })
    }

    public update() {
        let layersInView : [number, number] = this.layersInView()
    }

    private layerToYCoordinate(layer : number) {
        return layer * Config.blockHeight
    }

    public layersInView() : [number, number] {
        var layersThatFitInView = this.scene.cameras.main.height / Config.blockHeight
        var cameraBlockCenterY = this.scene.cameras.main.midPoint.y / Config.blockHeight
        return [Math.ceil(cameraBlockCenterY + layersThatFitInView/2), Math.floor(cameraBlockCenterY - layersThatFitInView/2)]
    }

    private backgrounds : Map<APIInterface.Background, Phaser.GameObjects.Image>
}