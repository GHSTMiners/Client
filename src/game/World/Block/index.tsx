import * as Schema from "matchmaking/Schemas";
import * as APIInterface from "chisel-api-interface"

export enum SoilType {
    Top = 'top',
    Middle = 'middle',
    Bottom = 'bottom'
  }

export default class Block extends Phaser.GameObjects.Container {
    constructor(scene : Phaser.Scene, blockInfo: Schema.Block, soilType: SoilType, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y, children)
        if(blockInfo) {
            this.blockInfo = blockInfo;
            //Create sprites and images
            this.backgroundSprite = new Phaser.GameObjects.Image(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`);
            switch(blockInfo.spawnType) {
                case APIInterface.SpawnType.Crypto: 
                    this.itemSprite = new Phaser.GameObjects.Image(scene, 0, 0, `crypto_soil_${blockInfo.spawnID}`)
                    this.foregroundSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`)
                    this.add([this.backgroundSprite, this.foregroundSprite, this.itemSprite])
                break;
                case APIInterface.SpawnType.Rock: 
                    this.itemSprite = new Phaser.GameObjects.Image(scene, 0, 0, `rock_${blockInfo.spawnID}`)
                    this.foregroundSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`)
                    this.add([this.backgroundSprite, this.foregroundSprite, this.itemSprite])
                break;
                case APIInterface.SpawnType.WhiteSpace: 
                    this.foregroundSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, `soil_${soilType}_${blockInfo.soilID}`)
                    this.add([this.backgroundSprite, this.foregroundSprite])
                break;
                case APIInterface.SpawnType.None:
                    this.backgroundSprite.setAlpha(0.5)
                    this.add(this.backgroundSprite)
                break;
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
}