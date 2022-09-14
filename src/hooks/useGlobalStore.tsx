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
    playerCrystals: IndexedArray,
}

type Actions = {
    setWorldCrypto: (crypto:IndexedCrypto) => void
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
    playerCrystals: {} ,
    // Settings methods
    setWorldCrypto: (crypto) => { 
        set( (state) => ({ ...state, worldCrypto : crypto }) ) }
}))

//export default useGlobalStore