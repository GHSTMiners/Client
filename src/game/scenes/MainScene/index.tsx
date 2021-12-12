import GlobalRenderer from "game/Rendering/GlobalRenderer";
import * as Phaser from "phaser"

export default class LoadingScene extends Phaser.Scene {
    graphics!: Phaser.GameObjects.Graphics;
    newGraphics!: Phaser.GameObjects.Graphics;

    constructor() {
        super({key: 'MainScene'})
    }

    create() {
        this.globalRenderer = new GlobalRenderer(this)
        this.cameras.main.y += 600
    }

    update(time: number, delta: number): void {
    }

    private globalRenderer? : GlobalRenderer
}