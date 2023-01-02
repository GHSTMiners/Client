import MainScene from "game/Scenes/MainScene";
import * as Schema from "matchmaking/Schemas";
import { useGlobalStore } from "store";


export default class Explosive extends Phaser.GameObjects.Image {
    constructor(scene : MainScene, schema : Schema.Explosive) {
        super(scene, schema.x, schema.y, `explosive_soil_${schema.explosiveID}`)
        this.schema = schema
        this.soundFXManager = scene.soundFXManager;
        this.setDepth(40);
        this.setOrigin(0, 0);
        const worldExplosives = useGlobalStore.getState().worldExplosives; 
        if (worldExplosives[schema.explosiveID]?.name === 'Nuke'){
            this.sound = this.soundFXManager.add('nuke');
            this.soundFXManager.play('nuke')
        } else {
            this.sound = this.soundFXManager.add('fuse');
            this.soundFXManager.playAtLocation( this.sound, this.schema.x, this.schema.y)
        }
    }

    public update(time: number, delta: number) {
        this.setPosition(this.schema.x, this.schema.y)
        this.soundFXManager.playAtLocation( this.sound, this.schema.x, this.schema.y)
    }

    public explode() {
        this.visible = false; // hide bomb as soon as the explosion starts
        this.sound = this.soundFXManager.add('explosion');
        this.soundFXManager.playAtLocation( this.sound, this.schema.x, this.schema.y)
    }

    private sound
    private soundFXManager
    private schema : Schema.Explosive
}