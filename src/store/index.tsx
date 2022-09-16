import { IndexedArray, IndexedCrypto, InventoryExplosives, PlayerVitals } from 'types'
import create from 'zustand'

type State = {
    worldCrypto: IndexedCrypto,
    worldExplosives: InventoryExplosives, 
    playerCrypto: IndexedArray,
    playerTotalValue: number,
    playerExplosives: IndexedArray, 
    playerDepth: number, 
    playerVitals : PlayerVitals,
    playerCargo: IndexedArray,
}

type Actions = {
    setWorldCrypto: (crypto:IndexedCrypto) => void
    setWorldExplosives: (explosives:InventoryExplosives) => void
    updatePlayerCrypto: (key:string,quantity:number) => void
    updatePlayerCargo: (key:string,quantity:number) => void
    setPlayerDepth: (depth:number) => void
}

export const useGlobalStore = create<State & Actions>((set) => ({
    // Global Variables
    worldCrypto: {},
    worldExplosives: {}, 
    playerCrypto: {},
    playerTotalValue: 0,
    playerExplosives: {}, 
    playerDepth: 0 , 
    playerVitals : {} as PlayerVitals,
    playerCargo: {} ,

    // Settings methods
    setWorldCrypto: (crypto) => { 
        set( () => ({ worldCrypto : crypto }) ) 
    },
    setWorldExplosives: (explosives) => { 
        set( () => ({ worldExplosives : explosives }) ) 
    },
    updatePlayerCrypto: (key,quantity) => {
        set( (state) => ({ playerCrypto: { ...state.playerCrypto, [key]:quantity } }) )
        set( (state) => {
             const total = Object.keys(state.playerCrypto).reduce( 
                (accumulated, key) =>  state.playerCrypto[key] * state.worldCrypto[key].price + accumulated, 0  )
            return(
                { playerTotalValue: Math.round(total*10)/10 }
            )
        })
    },
    updatePlayerCargo: (key,quantity) => {
        set( (state) => ({ playerCargo: {...state.playerCargo, [key]: quantity}}) )
    },
    setPlayerDepth: (depth) => {
        set( () => ({ playerDepth: depth}))
    }    
}))

//export default useGlobalStore