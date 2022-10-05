import Client from "matchmaking/Client"
import * as Protocol from "gotchiminer-multiplayer-protocol"
import * as Schema from "matchmaking/Schemas";
import Explosive from "game/World/Explosive";
import { ExplosionAnimation } from "game/World/ExplosionAnimation";
import MainScene from "game/Scenes/MainScene";

export default class ExplosiveRenderer extends Phaser.GameObjects.GameObject {
    constructor(scene : MainScene) {
        super(scene, "ExplosivesManager")
        Client.getInstance().messageRouter.addRoute(Protocol.NotifyBombExploded, this.handleBombExploded.bind(this))
        Client.getInstance().colyseusRoom.state.explosives.onAdd = this.handleBombAdded.bind(this)
        Client.getInstance().colyseusRoom.state.explosives.onRemove = this.handleBombRemove.bind(this)
        this.explosives = new Map<Schema.Explosive, Explosive>()
    }

    private handleBombAdded(explosive : Schema.Explosive, key : number) {
        //Create new explosive
        let newExplosive : Explosive = new Explosive(this.scene as MainScene, explosive);
        this.explosives.set(explosive, newExplosive)
        this.scene.add.existing(newExplosive)
    }

    private handleBombRemove(explosive : Schema.Explosive, key : number) {
        let explosiveEntry : Explosive | undefined = this.explosives.get(explosive)
        if(explosiveEntry) {
            this.explosives.delete(explosive)
            explosiveEntry.explode()
        }
    }

    update(time: number, delta: number): void {
        this.explosives.forEach((value, key) => {
            value.update(time, delta)
        })
    }

    private handleBombExploded(notification : Protocol.NotifyBombExploded) {
        //Create sprite
        let explosionSprite : ExplosionAnimation = new ExplosionAnimation(this.scene, notification.x, notification.y)
        this.scene.add.existing(explosionSprite)

        Client.getInstance().chiselWorld.explosives.find(({ id }) => id === notification.bombId)?.explosion_coordinates.forEach(coordinate=> {
            let explosionSprite : ExplosionAnimation = new ExplosionAnimation(this.scene, notification.x + coordinate.y, notification.y + coordinate.x)
            this.scene.add.existing(explosionSprite) 
        })


        // Playing explosive sound if loaded correctly from Chisel
        // if (this.scene.sound.get(`explosive_${notification.bombId}`)==null){

        //     this.scene.sound.play('explosion', {})
        // } else {
        //     this.scene.sound.play(`explosive_${notification.bombId}`, {})
        // }  
    }

    private explosives :  Map<Schema.Explosive, Explosive>
}