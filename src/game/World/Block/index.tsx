import * as Schema from "matchmaking/Schemas";
import * as APIInterface from "chisel-api-interface"
import { SpawnType } from "chisel-api-interface";

export enum SoilType {
    Top = 'top',
    Middle = 'middle',
    Bottom = 'bottom'
  }

export default class Block extends Phaser.GameObjects.Container {
    constructor(scene : Phaser.Scene, blockInfo: Schema.Block, soilType: SoilType, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y, children)
        this.setDepth(1)
        this.soilType = soilType
        if(blockInfo) {
            this.blockInfo = blockInfo;
            this.blockInfo.onChange = this.blockUpdated.bind(this)
            //Create sprites and images
            switch(blockInfo.spawnType) {
                case APIInterface.SpawnType.Crypto: 
                    this.itemSprite = new Phaser.GameObjects.Image(scene, 0, 0, `crypto_soil_${blockInfo.spawnID}`)
                    this.foregroundSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`)
                    this.add([this.foregroundSprite, this.itemSprite])
                break;
                case APIInterface.SpawnType.Rock: 
                    this.itemSprite = new Phaser.GameObjects.Image(scene, 0, 0, `rock_${blockInfo.spawnID}`)
                    this.foregroundSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`)
                    this.add([this.foregroundSprite, this.itemSprite])
                break;
                case APIInterface.SpawnType.WhiteSpace: 
                    this.foregroundSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`)
                    this.add([this.foregroundSprite])
                break;
                case APIInterface.SpawnType.None:
                    this.backgroundSprite = new Phaser.GameObjects.Image(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`);
                    this.backgroundSprite.setAlpha(0.5)
                    this.add(this.backgroundSprite)
                break;
            }
        }
    }

    private blockUpdated() {
        if(this.blockInfo?.spawnType == SpawnType.None && this.foregroundSprite && this.backgroundSprite) {
            this.backgroundSprite = new Phaser.GameObjects.Image(this.scene, 0, 0, `soil_${this.soilType}_${this.blockInfo.soilID}`);
            this.backgroundSprite.setAlpha(0.5)
            this.add(this.backgroundSprite)
            this.remove(this.foregroundSprite, true)
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
    public foregroundSprite? : Phaser.GameObjects.Sprite
    public itemSprite?: Phaser.GameObjects.Image
    private blockInfo? : Schema.Block
    private soilType : SoilType
}