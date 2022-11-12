import { Player } from "../Player";
import * as Schema from "matchmaking/Schemas";
import { useGlobalStore } from "store"
import Config from "config";
import MainScene from "game/Scenes/MainScene";

export default class MainPlayer extends Player {
    constructor(scene: MainScene, player: Schema.Player) {
        super(scene, player)
        this.storeCargo();
        this.storeWallet();
        this.storeExplosives();
        this.storeDepth();
        this.storeVitals();
        this.storePlayerState();
        console.log('Main player initialized')
    }

    public storeCargo(){
        this.playerSchema.cargo.onAdd = (cargo) => {
            useGlobalStore.getState().setCargo(`${cargo.cryptoID}`,cargo.amount)
            cargo.onChange= () => useGlobalStore.getState().setCargo(`${cargo.cryptoID}`,cargo.amount)
        }
        this.playerSchema.cargo.onRemove = (cargo) => useGlobalStore.getState().setCargo(`${cargo.cryptoID}`,0)
    }

    storeWallet(){
        this.playerSchema.wallet.onAdd = (crypto) => {
            useGlobalStore.getState().setWallet(`${crypto.cryptoID}`,crypto.amount)
            crypto.onChange= () => useGlobalStore.getState().setWallet(`${crypto.cryptoID}`,crypto.amount)
        }
    }

    storeExplosives(){
        this.playerSchema.explosives.onAdd = (explosives) => {
            useGlobalStore.getState().setExplosives(`${explosives.explosiveID}`,explosives.amount)
            explosives.onChange= () => useGlobalStore.getState().setExplosives(`${explosives.explosiveID}`,explosives.amount)
        }
    }

    storeDepth(){
        this.playerSchema.playerState.onChange = (stateChange) => {
            stateChange.forEach( (entry) => {
                if (entry.field === 'y'){
                    useGlobalStore.getState().setDepth( Math.ceil(entry.value / Config.blockHeight) )
                }
            })
        }
    }

    storeVitals(){
        this.playerSchema.vitals.forEach( vital =>{
            switch(vital.name){
                case 'Fuel':
                    vital.onChange = () => { 
                        const level = vital.currentValue / vital.filledValue * 100;
                        useGlobalStore.getState().setVitals( 'fuel', level );
                    }
                    break;
                case 'Health':
                    vital.onChange = () => { 
                        const level = vital.currentValue / vital.filledValue * 100;
                        useGlobalStore.getState().setVitals( 'health', level );
                    }
                    break;
                case 'Cargo':
                    vital.onChange = () => { 
                        const level = Math.ceil((1 - vital.currentValue / vital.filledValue) * 100);
                        useGlobalStore.getState().setVitals( 'cargo', level );
                    }
                    break;
                default:
                    break;
            }
            
        })
    }

    storePlayerState(){
        useGlobalStore.getState().setPlayerState( this.playerSchema.playerState );
    }

    update(time: number, delta: number): void {
        // Update player 
        super.update(time, delta)
    }
}