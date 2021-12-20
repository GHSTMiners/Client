import * as Schema from "matchmaking/Schemas";
import * as Phaser from "phaser"

export class Player extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, player: Schema.Player) {
        super(scene, player.x, player.y)
        this.playerSchema = player
        this.playerSprite = this.scene.add.sprite(player.x, player.y, 'aavegotchi')
        this.add(this.playerSprite)
        console.log(`Player position ${player.x}, ${player.y}`)
        player.onChange = this.locationChanged.bind(this)
    }

    private locationChanged() {
        this.setPosition(this.playerSchema.x, this.playerSchema.y)
    }

    private playerSchema : Schema.Player
    private playerSprite : Phaser.GameObjects.Sprite
}