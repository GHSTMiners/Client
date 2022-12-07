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
        this.blockInfo = {soilID : -1, spawnID : -1, spawnType: -1}
        this.itemSprite = new Phaser.GameObjects.Image(scene, 0, 0, ``)
        this.backgroundSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, ``)
        this.add([this.backgroundSprite, this.itemSprite])

        this.soilType = soilType
        this.updateBlock(blockInfo, soilType)

    }

    public updateBlock(blockInfo : BlockInterface, soilType : SoilType) {

        if (this.blockInfo?.soilID !== blockInfo.soilID || this.soilType !== soilType) {
            this.soilType = soilType
            this.blockInfo.soilID = blockInfo.soilID
            this.backgroundSprite.setTexture(`soil_${this.soilType}_${blockInfo.soilID}`)
            this.backgroundSprite.displayHeight = 128
            this.backgroundSprite.displayWidth = 128
        }       
        if(this.blockInfo?.spawnType !== blockInfo.spawnType || this.blockInfo?.spawnID !== blockInfo.spawnID) {
            this.blockInfo = blockInfo
            switch(blockInfo.spawnType) {
                case APIInterface.SpawnType.Crypto: 
                    this.itemSprite.setTexture(`crypto_soil_${blockInfo.spawnID}`)
                    this.backgroundSprite.clearTint()
                    this.itemSprite.visible = true
                break;
                case APIInterface.SpawnType.Rock: 
                    this.itemSprite.setTexture(`rock_${blockInfo.spawnID}`)
                    this.backgroundSprite.clearTint()
                    this.itemSprite.visible = true

                break;
                case APIInterface.SpawnType.WhiteSpace: 
                    this.backgroundSprite.clearTint()
                    this.itemSprite.visible = false
                break;
                case APIInterface.SpawnType.FallThrough:
                case APIInterface.SpawnType.None:
                    this.itemSprite.visible = false
                    this.backgroundSprite.setTint(0x808080)
                break;
            }
            // Scale images
            this.itemSprite.displayHeight = 128
            this.itemSprite.displayWidth = 128
        }
    }

    protected preDestroy(): void {
        this.removeAll(true)
    }

    public backgroundSprite : Phaser.GameObjects.Sprite
    public itemSprite: Phaser.GameObjects.Image
    private blockInfo : BlockInterface
    private soilType : SoilType
}