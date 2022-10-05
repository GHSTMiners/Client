export class Coin extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, cryptoID : string ) {
        super(scene, 0, 0, cryptoID);
        this.cryptoID = cryptoID;
    }

    public delete () {
        this.destroy();
    }

    private cryptoID
}
