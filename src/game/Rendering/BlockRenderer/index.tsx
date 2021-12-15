import Config from "config";
import Block from "game/World/Block"
import Client from "matchmaking/Client"

export default class BlockRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "BlockRenderer")
        this.renderedLayers = new Map<number, Phaser.GameObjects.Group>();
        var self = this;
        setTimeout(function() {
            for (let layer = 0; layer < 30; layer++) {
                self.renderLayer(layer);
            }
        }, 1000);
    }

    private renderLayer(layer : number) {
        let worldWidth = Client.getInstance().colyseusRoom?.state.width;
        let startIndex = layer * worldWidth;
        let newLayer = this.scene.add.group()
        for (let index = 0; index < worldWidth; index++) {
            const element = Client.getInstance().colyseusRoom.state.blocks[startIndex + index];
            let newBlock = new Block(this.scene, element, index * Config.blockWidth + Config.blockWidthOffset, layer * Config.blockWidth + Config.blockHeightOffset);
            newLayer.add(newBlock)
            this.scene.add.existing(newBlock)
        }
        this.renderedLayers.set(layer, newLayer);
    }

    public update() {

    }

    private renderedLayers : Map<number, Phaser.GameObjects.Group>
}