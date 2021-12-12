import BlockRenderer from "../BlockRenderer"

export default class GlobalRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "GlobalRenderer")
        this.blockRenderer = new BlockRenderer(scene)
    }

    private blockRenderer : BlockRenderer
}