import Config from "config";
import Block from "game/World/Block"
import * as Schema from "matchmaking/Schemas";
import Client from "matchmaking/Client"

export default class BlockRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "BlockRenderer")
        this.renderedLayers = new Map<number, Block[]>();
        Client.getInstance().colyseusRoom.state.blocks.onChange = this.blockUpdated.bind(this)
        Client.getInstance().colyseusRoom.state.blocks.onAdd = this.blockUpdated.bind(this)

    }

    private renderLayer(layer : number) {
        if(!this.renderedLayers.has(layer) ) {
            let worldWidth = Client.getInstance().chiselWorld.width;
            let startIndex = layer * worldWidth;
            let newLayer : Block[] = []
            for (let index = 0; index < worldWidth; index++) {
                const element = Client.getInstance().colyseusRoom.state.blocks[startIndex + index];
                let newBlock = new Block(this.scene, element, index * Config.blockWidth + Config.blockWidthOffset, layer * Config.blockHeight + Config.blockHeightOffset);
                newLayer.push(newBlock)
                this.scene.add.existing(newBlock)
            }
            this.renderedLayers.set(layer, newLayer);
        }
    }

    private blockUpdated(block: Schema.Block, key: number) : void {
        let blockLayer = Math.floor(key / Client.getInstance().chiselWorld.width);
        let blockColumn = key - blockLayer * Client.getInstance().chiselWorld.width
        let renderedLayer : Block[] | undefined = this.renderedLayers.get(blockLayer) 

        if(renderedLayer) {
            renderedLayer[blockColumn].destroy()
            renderedLayer[blockColumn] = new Block(this.scene, block, blockColumn * Config.blockWidth + Config.blockWidthOffset, blockLayer * Config.blockHeight + Config.blockHeightOffset)
            this.scene.add.existing(renderedLayer[blockColumn])
        }
    }

    private unrenderLayer(layer : number) {
        if(this.renderedLayers.has(layer)) {
            this.renderedLayers.delete(layer)
        } else {
            console.debug(`Skipping unrendering of layer ${layer} because it is not rendered`)
        }
    }

    public update() {
        let currentLayersInView : [number, number] = this.layersInView();
        if(currentLayersInView !== this.lastlayersInView) {
            this.lastlayersInView = currentLayersInView;
            //Create a list of layers that should be in view
            const range = (start : number, end : number) => Array.from(Array(end - start + 1).keys()).map(x => x + start);
            let layersToRender : number[] = range(currentLayersInView[1], currentLayersInView[0])
            //Unrender layers that should not be rendered
            for(const renderedLayer of this.renderedLayers.keys()) {
                if(!layersToRender.includes(renderedLayer)) this.unrenderLayer(renderedLayer)
            }
            //Render layers that should be rendered
            for(const layerToRender of layersToRender) {
                this.renderLayer(layerToRender)
            }
        }
    }

    public layersInView() : [number, number] {
        var layersThatFitInView = this.scene.cameras.main.height / Config.blockHeight
        var cameraBlockCenterY = this.scene.cameras.main.midPoint.y / Config.blockHeight
        return [Math.round(cameraBlockCenterY + layersThatFitInView/2), Math.round(cameraBlockCenterY - layersThatFitInView/2)]
    }

    private lastlayersInView : [number, number] = [-1, -1]
    private renderedLayers : Map<number, Block[]>
}