import Config from "config"
import Client from "matchmaking/Client"
import BlockRenderer from "../BlockRenderer"
import BackgroundRenderer from "../BackgroundRenderer"
import PlayerRenderer from "../PlayerRenderer"
export default class GlobalRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "GlobalRenderer")
        this.blockRenderer = new BlockRenderer(scene)
        this.backgroundRenderer = new BackgroundRenderer(scene)
        this.playerRender = new PlayerRenderer(scene)

        this.scene.cameras.main.setBounds(0, -Config.skyHeight, 
            Client.getInstance().chiselWorld.width * Config.blockWidth, Config.skyHeight + Client.getInstance().chiselWorld.height * Config.blockHeight);
        console.log(`Size of world is now: width: ${Client.getInstance().chiselWorld.width}, height: ${Client.getInstance().chiselWorld.height}`)
    }

    public update(time: number, delta: number) {
        this.blockRenderer.update();
        this.playerRender.update(time, delta);
    }

    private blockRenderer : BlockRenderer
    private playerRender : PlayerRenderer
    private backgroundRenderer : BackgroundRenderer
}