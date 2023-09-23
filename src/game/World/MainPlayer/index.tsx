import { Player } from "../Player";
import * as Schema from "matchmaking/Schemas";
import { useGlobalStore } from "store"
import Config from "config";
import MainScene from "game/Scenes/MainScene";
import Client from "matchmaking/Client";
import * as Protocol from "gotchiminer-multiplayer-protocol"

export default class MainPlayer extends Player {
    constructor(scene: MainScene, player: Schema.Player) {
        super(scene, player)
        this.storeCargo();
        this.storeWallet();
        this.storeExplosives();
        this.storeConsumables();
        this.storeDepth();
        this.storeVitals();
        this.storePlayerState();
        document.addEventListener("visibilitychange", this.stopPlayer );  
        document.addEventListener("blur", this.stopPlayer );  
        console.log('😎 Main player initialized')
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
        this.playerSchema.explosives.onAdd = (explosive) => {
            explosive.onChange= () => {
                useGlobalStore.getState().setExplosives(`${explosive.explosiveID}`,{
                    amount: explosive.amount, 
                    nextTimeAvailable: explosive.nextTimeAvailable,
                    amountSpawned: explosive.amountSpawned,
                    amountPurchased: explosive.amountPurchased
                })
            }
        }
    }

    storeConsumables(){
        this.playerSchema.consumables.onAdd = (consumable) => {
            consumable.onChange= () => {
                useGlobalStore.getState().setConsumables(`${consumable.consumableID}`,{
                    amount: consumable.amount, 
                    nextTimeAvailable: consumable.nextTimeAvailable,
                    amountSpawned: consumable.amountSpawned,
                    amountPurchased: consumable.amountPurchased
                })
            }
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
                        const level = Math.round((1 - vital.currentValue / Math.round(vital.filledValue) ) * 100);
                        useGlobalStore.getState().setVitals( 'cargo', (level<0)? 0 : level );
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

    public stopPlayer(event:Event){
        let directionChangedMessage : Protocol.ChangeDirection = new Protocol.ChangeDirection();
        directionChangedMessage.x = 0;
        directionChangedMessage.y = 0;
        let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(directionChangedMessage)
        Client.getInstance().colyseusRoom.send(serializedMessage.name, serializedMessage.data)   
    }

    update(time: number, delta: number): void {
        // Update player 
        super.update(time, delta)
    }

    destroy(fromScene?: boolean | undefined): void {
        document.removeEventListener("visibilitychange", this.stopPlayer);
        document.removeEventListener("blur", this.stopPlayer);
        super.destroy(fromScene);
    }
}