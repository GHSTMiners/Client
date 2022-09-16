import { Player } from "../Player";
import * as Schema from "matchmaking/Schemas";
import { useGlobalStore } from "store"
import Config from "config";

export default class MainPlayer extends Player {
    constructor(scene: Phaser.Scene, player: Schema.Player) {
        super(scene, player)

        // subscribing global store to player schemas
        this.playerSchema.wallet.onAdd = (crypto) => {
            useGlobalStore.getState().updatePlayerCrypto(`${crypto.cryptoID}`,crypto.amount)
            crypto.onChange= () => useGlobalStore.getState().updatePlayerCrypto(`${crypto.cryptoID}`,crypto.amount)
        }
        this.playerSchema.cargo.onAdd = (cargo) => {
            useGlobalStore.getState().updatePlayerCargo(`${cargo.cryptoID}`,cargo.amount)
            cargo.onChange= () => useGlobalStore.getState().updatePlayerCargo(`${cargo.cryptoID}`,cargo.amount)
        }
        this.playerSchema.playerState.onChange = (stateChange) => {
            stateChange.forEach( (entry) => {
                if (entry.field === 'y'){
                    useGlobalStore.getState().setPlayerDepth( Math.ceil(entry.value / Config.blockHeight) )
                }
            })
        }

        console.log('Main player initialized')
    }

    update(time: number, delta: number): void {
        // Update player 
        super.update(time, delta)
    }
}