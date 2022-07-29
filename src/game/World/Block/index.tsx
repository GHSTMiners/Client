import * as APIInterface from "chisel-api-interface"
import { SpawnType } from "chisel-api-interface";
import { BlockInterface } from "game/helpers/BlockSchemaWrapper";

export enum SoilType {
    Top = 'top',
    Middle = 'middle',
    Bottom = 'bottom'
  }

export default class Block extends Phaser.GameObjects.Container {
    constructor(scene : Phaser.Scene, blockInfo: BlockInterface, soilType: SoilType, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y, children)
        this.setDepth(10)
        this.soilType = soilType
        if(blockInfo) {
            this.blockInfo = blockInfo;
            //Create sprites and images
            switch(blockInfo.spawnType) {
                case APIInterface.SpawnType.Crypto: 
                    this.itemSprite = new Phaser.GameObjects.Image(scene, 0, 0, `crypto_soil_${blockInfo.spawnID}`)
                    this.backgroundSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`)
                    this.add([this.backgroundSprite, this.itemSprite])
                break;
                case APIInterface.SpawnType.Rock: 
                    this.itemSprite = new Phaser.GameObjects.Image(scene, 0, 0, `rock_${blockInfo.spawnID}`)
                    this.backgroundSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`)
                    this.add([this.backgroundSprite, this.itemSprite])
                break;
                case APIInterface.SpawnType.WhiteSpace: 
                    this.backgroundSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`)
                    this.add([this.backgroundSprite])
                break;
                case APIInterface.SpawnType.None:
                    this.backgroundSprite = new Phaser.GameObjects.Image(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`);
                    this.backgroundSprite.setAlpha(0.5)
                    this.add(this.backgroundSprite)
                break;
            }
        }
    }

    public updateBlock(blockInfo : BlockInterface) {
        this.blockInfo = blockInfo
        this.blockUpdated()
    }

    private blockUpdated() {
        if(this.blockInfo?.spawnType === SpawnType.None && this.backgroundSprite ) {
            this.backgroundSprite.setAlpha(0.5)
            //Remove foreground sprite too if it exists
            if(this.itemSprite) {
                this.remove(this.itemSprite, true)
            }
        }

    }

    protected preDestroy(): void {
        this.removeAll(true)
    }

    public backgroundSprite? : Phaser.GameObjects.Image
    public itemSprite?: Phaser.GameObjects.Image
    private blockInfo? : BlockInterface
    private soilType : SoilType
}