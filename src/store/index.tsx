import { IndexedArray, IndexedCrypto, InventoryExplosives, PlayerVitals } from 'types'
import create from 'zustand'

type State = {
    // from schemas 
    cargo : IndexedArray,
    explosives: IndexedArray, 
    vitals : PlayerVitals,
    wallet : IndexedArray,
    // extra
    worldCrypto: IndexedCrypto,
    worldExplosives: InventoryExplosives, 
    totalValue: number,
    depth: number,
}

type Actions = {
    setCargo: (key:string,quantity:number) => void
    setExplosives: (key:string,quantity:number) => void
    setVitals: (field:string, level:number) => void
    setWallet: (key:string,quantity:number) => void
    setDepth: (depth:number) => void
    setWorldCrypto: (crypto:IndexedCrypto) => void
    setWorldExplosives: (explosives:InventoryExplosives) => void
}

export const useGlobalStore = create<State & Actions>((set) => ({
    // Global Variables
    worldCrypto: {},
    worldExplosives: {}, 
    wallet : {},
    totalValue: 0,
    explosives: {}, 
    depth: 0 , 
    vitals : {fuel: 100, health: 100, cargo:0} ,
    cargo: {} ,

    // Settings methods
    setWorldCrypto: (crypto) => { 
        set( () => ({ worldCrypto : crypto }) ) 
    },
    setWorldExplosives: (explosives) => { 
        set( () => ({ worldExplosives : explosives }) ) 
    },
    setCargo: (key,quantity) => {
        set( (state) => ({ cargo: {...state.cargo, [key]: quantity}}) )
    },
    setDepth: (depth) => {
        set( () => ({ depth: depth}))
    },
    setVitals: ( vital , level) => {
        set( (state) => ({ vitals: { ...state.vitals, [vital]:level } }))
    },
    setExplosives: (key,quantity) => {
        set( (state) => ({ explosives: {...state.explosives, [key]: quantity}}) )
    },
    setWallet: (key,quantity) => {
        set( (state) => ({ wallet : { ...state.wallet , [key]:quantity } }) )
        set( (state) => {
             const total = Object.keys(state.wallet ).reduce( 
                (accumulated, key) =>  state.wallet[key] * state.worldCrypto[key].price + accumulated, 0  )
            return(
                { totalValue: Math.round(total*10)/10 }
            )
        })
    }  
}))

//export default useGlobalStore