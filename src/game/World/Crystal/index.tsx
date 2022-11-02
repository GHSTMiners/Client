import Config from "config";
import MainScene from "game/Scenes/MainScene";
import Client from "matchmaking/Client";

export class Crystal extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, cryptoID : string ) {
        super(scene, 0, 0, cryptoID);
        this.cryptoID = cryptoID;
        this.setDepth(30)
        this.scene.physics.add.existing(this, false)
        this.body.velocity.x = 1000 * ( Math.random()*2 - 1 );
        this.body.velocity.y = -1000 * ( Math.random()*2 - 1 );
        (this.body as Phaser.Physics.Arcade.Body).setAccelerationY(1000)
        this.setTexture(`crypto_soil_${cryptoID}`)
        this.setSize( Config.blockWidth, Config.blockHeight )
        this.displayHeight = Config.blockHeight;
        this.displayWidth = Config.blockWidth;
        this.setOrigin(0, 0)
        const myGotchiID = Client.getInstance().ownPlayer.gotchiID;
        this.myPlayer  = (scene as MainScene).globalRenderer?.playerRender.playerSprites.get( myGotchiID )        
        if (this.myPlayer) this.myPlayer.add(this)
        this.scene.time.delayedCall( 2000, this.delete.bind(this))
    }

    public delete () {
        if (this.myPlayer) this.myPlayer.remove(this)
        this.destroy();
    }

    private myPlayer
    private cryptoID
}
