import { Player } from "../Player";
import * as Schema from "matchmaking/Schemas";
import { useGlobalStore } from "hooks/useGlobalStore"

export default class MainPlayer extends Player {
    constructor(scene: Phaser.Scene, player: Schema.Player) {
        super(scene, player)
        // subscribing global store to player schemas
        this.playerSchema.wallet.onAdd = (crypto) =>{
            useGlobalStore.getState().updatePlayerCrypto(`${crypto.cryptoID}`,crypto.amount)
            crypto.onChange= () => useGlobalStore.getState().updatePlayerCrypto(`${crypto.cryptoID}`,crypto.amount)
        }

        console.log('Main player initialized')
    }

    update(time: number, delta: number): void {
        // Update player 
        super.update(time, delta)
    }
}