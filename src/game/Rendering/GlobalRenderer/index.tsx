import Config from "config"
import Client from "matchmaking/Client"
import BlockRenderer from "../BlockRenderer"
export default class GlobalRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "GlobalRenderer")
        this.blockRenderer = new BlockRenderer(scene)
        this.scene.cameras.main.setBounds(0, -Config.skyHeight, 
            Client.getInstance().chiselWorld.width * Config.blockWidth, Config.skyHeight + Client.getInstance().chiselWorld.height * Config.blockHeight);
        console.log(`Size of world is now: widht: ${Client.getInstance().chiselWorld.width}, height: ${Client.getInstance().chiselWorld.height}`)
    }

    public update() {
        this.blockRenderer.update()
    }

    private blockRenderer : BlockRenderer
}