import Config from "config";
import Block, { SoilType } from "game/World/Block"
import Client from "matchmaking/Client"
import { Soil } from "chisel-api-interface";
import { BlockSchemaWrapper } from "game/helpers/BlockSchemaWrapper";

export default class BlockRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : Phaser.Scene) {
        super(scene, "BlockRenderer")
        this.layerBuffer = Array<Phaser.GameObjects.Container>();
        this.renderedLayers = new Map<number, Phaser.GameObjects.Container>();
        this.layerToSoilType = this.generateLayerToSoil()
        this.generateLayerToSoil()
        // Configure block change callback
    }

    private renderLayer(layer : number) {
        if(layer >= 0 && !this.renderedLayers.has(layer) ) {
            let worldWidth = Client.getInstance().chiselWorld.width;
            let soilType : SoilType = this.layerToSoilType[layer];
            let targetLayer : Phaser.GameObjects.Container = (this.layerBuffer.length > 0) ? this.layerBuffer.pop()! : this.scene.add.container()
            
            // Configure layer
            targetLayer.active = true
            targetLayer.setY(layer * Config.blockHeight)
            
            // Bind to schema
            let schemaLayer = Client.getInstance().colyseusRoom.state.layers[layer]
            var self = this;
            schemaLayer.blocks.onChange = (item: number, key: number) => {
                let blocks : Phaser.GameObjects.Container | undefined = self.renderedLayers.get(layer)
                if(blocks) {
                    (blocks.list[key] as Block).updateBlock(BlockSchemaWrapper.stringToBlock(item), soilType)
                }
            }

            //Write blocks
            for (let index = 0; index < worldWidth; index++) {
                const element = schemaLayer.blocks[index];
                if(targetLayer.list.length > index) {
                    const targetBlock = targetLayer.list.at(index) as Block
                    targetBlock.updateBlock(BlockSchemaWrapper.stringToBlock(element), soilType)
                } else {
                    let newBlock = new Block(this.scene, BlockSchemaWrapper.stringToBlock(element), soilType, index * Config.blockWidth + Config.blockWidthOffset, 0 + Config.blockHeightOffset);
                    targetLayer.add(newBlock)
                }
            }
            this.renderedLayers.set(layer, targetLayer);
            
        }
    }
    private unrenderLayer(layer : number) {
        // Unbind from schema
        let schemaLayer = Client.getInstance().colyseusRoom.state.layers[layer]
        schemaLayer.blocks.onChange = undefined

        // Remove layer from rendered layers and add to layer pool
        let targetLayer : Phaser.GameObjects.Container | undefined = this.renderedLayers.get(layer)
        if(targetLayer) {
            targetLayer.active = false;
            this.renderedLayers.delete(layer)
            this.layerBuffer.push(targetLayer)
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
        var layersThatFitInView = this.scene.cameras.main.height / this.scene.cameras.main.zoom / Config.blockHeight
        var cameraBlockCenterY = this.scene.cameras.main.midPoint.y / Config.blockHeight
        return [Math.ceil(cameraBlockCenterY + layersThatFitInView/2)+1, Math.floor(cameraBlockCenterY - layersThatFitInView/2)-1]
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
    private renderedLayers : Map<number, Phaser.GameObjects.Container>
    private layerBuffer : Array<Phaser.GameObjects.Container>
    private layerToSoilType : SoilType[]

}