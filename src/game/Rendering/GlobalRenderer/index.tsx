import Config from "config"
import Client from "matchmaking/Client"
import BlockRenderer from "../BlockRenderer"
import BackgroundRenderer from "../BackgroundRenderer"
import PlayerRenderer from "../PlayerRenderer"
import BuildingRenderer from "../BuildingRenderer"
import ExplosiveRenderer from "../ExplosiveRenderer"
export default class GlobalRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "GlobalRenderer")
        this.buildingRenderer = new BuildingRenderer(scene)
        this.blockRenderer = new BlockRenderer(scene)
        this.backgroundRenderer = new BackgroundRenderer(scene)
        this.playerRender = new PlayerRenderer(scene)
        this.explosiveRenderer = new ExplosiveRenderer(scene)
        this.scene.cameras.main.setBounds(0, -Config.skyHeight, 
            Client.getInstance().chiselWorld.width * Config.blockWidth, Config.skyHeight + Client.getInstance().chiselWorld.height * Config.blockHeight);
        console.log(`Size of world is now: width: ${Client.getInstance().chiselWorld.width}, height: ${Client.getInstance().chiselWorld.height}`)
    }

    public update(time: number, delta: number) {
        this.blockRenderer.update();
        this.playerRender.update(time, delta);
        this.explosiveRenderer.update(time, delta);
    }

    private explosiveRenderer : ExplosiveRenderer
    private buildingRenderer : BuildingRenderer
    private blockRenderer : BlockRenderer
    public playerRender : PlayerRenderer
    private backgroundRenderer : BackgroundRenderer
}