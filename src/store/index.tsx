import { ServerRegion } from 'chisel-api-interface/lib/ServerRegion'
import { StatisticEntry } from 'chisel-api-interface/lib/Statistics'
import { Player } from 'matchmaking/Schemas'
import Client from 'matchmaking/Client'
import * as Colyseus from 'colyseus.js'
import { IndexedArray, IndexedCrypto, IndexedPlayers, IndexedString, InventoryExplosives, PlayerVitals } from 'types'
import create from 'zustand'

type State = {
    // game schemas 
    cargo : IndexedArray,
    explosives: IndexedArray, 
    vitals : PlayerVitals,
    wallet : IndexedArray,
    players: IndexedPlayers,
    // lobby schemas
    lobbyCountdown : number,
    // extra
    worldCrypto: IndexedCrypto,
    worldExplosives: InventoryExplosives, 
    totalValue: number,
    depth: number,
    region: ServerRegion,
    serverRegions: ServerRegion[],
    gotchiSVGs: IndexedString,
    gotchiNames: IndexedString,
    roomLeaderboard: StatisticEntry[]
}

type Actions = {
    setCargo: (key:string,quantity:number) => void
    setExplosives: (key:string,quantity:number) => void
    setVitals: (field:string, level:number) => void
    setWallet: (key:string,quantity:number) => void
    setDepth: (depth:number) => void
    setPlayer: (key:string,player:Player) => void
    setCountdown : (time:number) => void
    setWorldCrypto: (crypto:IndexedCrypto) => void
    setWorldExplosives: (explosives:InventoryExplosives) => void
    setRegion: (region:ServerRegion) => void
    setServerRegions: (regions:ServerRegion[]) => void
    setGotchiSVG: (key:string,svg:string) => void
    setGotchiName: (key:string, name:string) => void
    setRoomLeaderboard: (data:StatisticEntry[]) => void
}

export const useGlobalStore = create<State & Actions>((set) => ({
    // Global Variables
    worldCrypto: {},
    worldExplosives: {}, 
    wallet : {},
    totalValue: 0,
    explosives: {}, 
    depth: 0 ,
    players: {},
    lobbyCountdown: 0,
    vitals : {fuel: 100, health: 100, cargo:0} ,
    cargo: {} ,
    region:{},
    serverRegions:[],
    gotchiSVGs: {},
    gotchiNames: {},
    roomLeaderboard:[],
    
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
    setPlayer: ( key , player) => {
        set( (state) => ({ players: { ...state.players, [key]:player } }))
    },
    setCountdown: ( time ) => {
        set( () => ({ lobbyCountdown: time }))
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
    },
    setRegion: (region) => {
        set( () => ({ region: region }) )
        const serverURL =  (process.env.NODE_ENV !== 'production') ? `wss://${region.url}` : "ws://localhost:2567";
        Client.getInstance().colyseusClient = new Colyseus.Client( serverURL ) 
        console.log(`Updated server region to URL:${serverURL}`)
    },
    setServerRegions: (regions) => {
        set( () => ({ serverRegions: regions }) )
    },
    setGotchiSVG: ( key , svg) => {
        set( (state) => ({ gotchiSVGs: { ...state.gotchiSVGs, [key]:svg } }))
    },
    setGotchiName: ( key , name ) =>{
        set( (state) => ({ gotchiNames: { ...state.gotchiNames, [key]:name } }))
    },
    setRoomLeaderboard: ( data ) =>{
        set( (state) => ({ roomLeaderboard: data }))
    }    
}))

//export default useGlobalStore