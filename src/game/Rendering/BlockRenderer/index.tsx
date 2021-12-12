import Block from "game/World/Block"
import Client from "matchmaking/Client"

export default class BlockRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "BlockRenderer")
        this.renderedLayers = new Map<number, Phaser.GameObjects.Group>();
        var self = this;
        setTimeout(function() {
            for (let layer = 0; layer < 10; layer++) {
                self.renderLayer(layer);
            }
        }, 2000);
    }

    private renderLayer(layer : number) {
        let worldWidth = Client.getInstance().colyseusRoom?.state.width;
        let startIndex = layer * worldWidth;
        let newLayer = this.scene.add.group()
        console.log(Client.getInstance().colyseusRoom.state.blocks[startIndex + 0])
        for (let index = 0; index < worldWidth; index++) {
            const element = Client.getInstance().colyseusRoom.state.blocks[startIndex + index];
            let newBlock = new Block(this.scene, element, index * 128, layer * 128);
            newLayer.add(newBlock)
            this.scene.add.existing(newBlock)
        }
        this.renderedLayers.set(layer, newLayer);
    }

    private renderedLayers : Map<number, Phaser.GameObjects.Group>
}