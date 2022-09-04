//import Config from "config";
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
        this.setOrigin(0, 0)
        const myGotchiID = Client.getInstance().ownPlayer.gotchiID;
        const myPlayer  = (scene as MainScene).globalRenderer?.playerRender.playerSprites.get( myGotchiID )        
        if (myPlayer) myPlayer.add(this)
        this.scene.time.delayedCall( 2000, this.destroy)
    }

    private cryptoID
}
