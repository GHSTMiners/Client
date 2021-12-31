import Config from "config";
import Block, { SoilType } from "game/World/Block"
import * as Schema from "matchmaking/Schemas";
import Client from "matchmaking/Client"
import { Soil } from "chisel-api-interface";

export default class BlockRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "BlockRenderer")
        this.renderedLayers = new Map<number, Block[]>();
        this.layerToSoilType = this.generateLayerToSoil()
        this.generateLayerToSoil()
        Client.getInstance().colyseusRoom.state.blocks.onChange = this.blockUpdated.bind(this)
        Client.getInstance().colyseusRoom.state.blocks.onAdd = this.blockUpdated.bind(this)
    }

    private renderLayer(layer : number) {
        if(!this.renderedLayers.has(layer) ) {
            let worldWidth = Client.getInstance().chiselWorld.width;
            let startIndex = layer * worldWidth;
            let newLayer : Block[] = []
            let soilType : SoilType = this.layerToSoilType[layer];
            for (let index = 0; index < worldWidth; index++) {
                const element = Client.getInstance().colyseusRoom.state.blocks[startIndex + index];
                let newBlock = new Block(this.scene, element, soilType, index * Config.blockWidth + Config.blockWidthOffset, layer * Config.blockHeight + Config.blockHeightOffset);
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
            let soilType : SoilType = this.layerToSoilType[blockLayer];
            renderedLayer[blockColumn].destroy()
            renderedLayer[blockColumn] = new Block(this.scene, block, soilType, blockColumn * Config.blockWidth + Config.blockWidthOffset, blockLayer * Config.blockHeight + Config.blockHeightOffset)
            this.scene.add.existing(renderedLayer[blockColumn])
        }
    }

    private unrenderLayer(layer : number) {
        let targetLayer : Block[] | undefined = this.renderedLayers.get(layer)
        if(targetLayer) {
            targetLayer.forEach(block => {
                block.destroy()
            })
            this.renderedLayers.delete(layer)
        } else {
            console.debug(`Skipping unrendering of layer ${layer} because it is not rendered`)
        }
    }

    public update() {
        let currentLayersInView : [number, number] = this.layersInView();
        if(currentLayersInView[0] !== this.lastlayersInView[0] || currentLayersInView[1] !== this.lastlayersInView[1]) {
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
        return [Math.ceil(cameraBlockCenterY + layersThatFitInView/2), Math.floor(cameraBlockCenterY - layersThatFitInView/2)]
    }

    private static sortSoil(a : Soil, b : Soil) {
        if ( a.order < b.order ){
            return -1;
          }
          if ( a.order > b.order ){
            return 1;
          }
          return 0;
    }

    private generateLayerToSoil() : SoilType[] {
        let layerToSoilType : SoilType[] = []
        let sortedSoil : Soil[] = Client.getInstance().chiselWorld.soil.sort(BlockRenderer.sortSoil);
        sortedSoil.forEach(soil => {
            layerToSoilType.push(SoilType.Top)
            for (let index = 0; index < soil.layers - 2; index++) {
                layerToSoilType.push(SoilType.Middle)                
            }
            layerToSoilType.push(SoilType.Bottom)
        })
        return layerToSoilType;
    }

    private lastlayersInView : [number, number] = [-1, -1]
    private renderedLayers : Map<number, Block[]>
    private layerToSoilType : SoilType[]

}