import Client from "matchmaking/Client"
import * as Schema from "matchmaking/Schemas";
import * as APIInterface from "chisel-api-interface"

export default class Block extends Phaser.GameObjects.Container {
    constructor(scene : Phaser.Scene, blockInfo: Schema.Block, x?: number, y?: number, children?: Phaser.GameObjects.GameObject[]) {
        super(scene, x, y, children)
        this.blockInfo = blockInfo;
        //Create sprites and images
        this.backgroundSprite = scene.add.image(0, 0, `soil_${blockInfo.soilID}`);
        switch(blockInfo.spawnType) {
            case APIInterface.SpawnType.Crypto: 
                this.itemSprite = scene.add.image(0, 0, `crypto_soil_${blockInfo.spawnID}`)
                this.foregroundSprite = scene.add.sprite(0, 0, `soil_middle_${blockInfo.soilID}`)
                this.add([this.backgroundSprite, this.foregroundSprite, this.itemSprite])
            break;
            case APIInterface.SpawnType.Rock: 
                this.itemSprite = scene.add.image(0, 0, `rock_${blockInfo.spawnID}`)
                this.foregroundSprite = scene.add.sprite(0, 0, `soil_middle_${blockInfo.soilID}`)
                this.add([this.backgroundSprite, this.foregroundSprite, this.itemSprite])
            break;
            case APIInterface.SpawnType.WhiteSpace: 
                this.foregroundSprite = scene.add.sprite(0, 0, `soil_middle_${blockInfo.soilID}`)
                this.add([this.backgroundSprite, this.foregroundSprite])
            break;
            case APIInterface.SpawnType.None:
                this.add(this.backgroundSprite)
            break;
        }
    }

    public backgroundSprite : Phaser.GameObjects.Image
    public foregroundSprite? : Phaser.GameObjects.Sprite
    public itemSprite?: Phaser.GameObjects.Image
    private blockInfo : Schema.Block
}