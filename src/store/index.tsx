import { ServerRegion } from 'chisel-api-interface/lib/ServerRegion'
import { StatisticEntry } from 'chisel-api-interface/lib/Statistics'
import { Player } from 'matchmaking/Schemas'
import Client from 'matchmaking/Client'
import * as Colyseus from 'colyseus.js'
import * as Schema  from "matchmaking/Schemas"
import { AavegotchiContractObject, IndexedArray, IndexedCrypto, IndexedItem, IndexedPlayers, IndexedString, InventoryExplosives, Item, PlayerVitals } from 'types'
import create from 'zustand'
import { ethers } from 'ethers'
import { AuthenticatorState, CookieSettings, KeyboardLayouts, SHORTCUTS, WalletApps } from 'helpers/vars'
import Cookies from 'js-cookie'

type State = {
    // game schemas 
    cargo : IndexedArray,
    explosives: IndexedArray, 
    vitals : PlayerVitals,
    wallet : IndexedArray,
    players: IndexedPlayers,
    playerState: Schema.PlayerState,
    // game settings
    soundFXVolume : number,
    musicVolume: number,
    keyboardLayout: KeyboardLayouts,
    // game UI
    userShortcuts: IndexedItem,
    isDraggingItem: boolean,
    // lobby schemas    
    lobbyCountdown : number,
    // web 3
    authenticatorState: AuthenticatorState,
    usersWalletAddress: string | undefined,
    usersProvider: ethers.providers.Web3Provider | undefined,
    walletProviderApp : WalletApps;
    usersChainId: number | undefined,
    // react pages
    usersAavegotchis: AavegotchiContractObject[],
    serverRegions: ServerRegion[],
    region: ServerRegion,
    isLoading: boolean,
    roomLeaderboard: StatisticEntry[],
    isDatabaseLoaded : boolean,
    isDatabaseAvailable : boolean,
    isWalletLoaded: boolean,
    gotchiSVGs: IndexedString,
    gotchiNames: IndexedString,
    settingsCookie: string,
    isGameLoaded: boolean,
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
    setPlayer: (key:string,player:Player) => void
    setPlayerState: (playerState: Schema.PlayerState) => void
    setSoundFXVolume: (volume: number) => void
    setMusicVolume: (volume: number) => void
    setKeyboardLayout: (layout:KeyboardLayouts) => void
    initializeUserSettings: () => void
    setUserShortcut: (id: number, item: Item) => void
    setIsDraggingItem: (state:boolean) => void
    setCountdown : (time:number) => void
    setWorldCrypto: (crypto:IndexedCrypto) => void
    setWorldExplosives: (explosives:InventoryExplosives) => void
    setUsersAavegotchis: ( gotchis: AavegotchiContractObject[]) => void
    setRegion: (region:ServerRegion) => void
    setServerRegions: (regions:ServerRegion[]) => void
    setGotchiSVG: (key:string,svg:string) => void
    setGotchiName: (key:string, name:string) => void
    setRoomLeaderboard: (data:StatisticEntry[]) => void
    setIsLoading: (value:boolean) => void
    setIsDatabaseLoaded: (value:boolean) => void
    setIsDatabaseAvailable: (value:boolean) => void
    setIsWalletLoaded: (value:boolean) => void
    setIsGameLoaded: (value:boolean) => void
    setUsersWalletAddress: (address:string | undefined) => void
    setUsersProvider: (provider:ethers.providers.Web3Provider | undefined) => void
    setUsersChainId: (chainId:number | undefined) => void
    setAuthenticatorState: (state:AuthenticatorState) => void
    setWalletProviderApp: (state:WalletApps) => void
    clearUserGameData: () => void
    clearUserWeb3Data: () => void
}

export const useGlobalStore = create<State & Actions>((set) => ({
    // Global Variables
    worldCrypto: {},
    worldExplosives: {}, 
    wallet : {},
    authenticatorState: AuthenticatorState.Start,
    totalValue: 0,
    explosives: {}, 
    depth: 0 ,
    players: {},
    playerState: {} as Schema.PlayerState,
    soundFXVolume : 1,
    keyboardLayout: KeyboardLayouts.QWERTY,
    musicVolume: 1,
    userShortcuts: {} as IndexedItem,
    isDraggingItem: false,
    lobbyCountdown: 0,
    vitals : {fuel: 100, health: 100, cargo:0} ,
    cargo: {} ,
    usersAavegotchis: [],
    region:{},
    serverRegions:[],
    gotchiSVGs: {},
    gotchiNames: {},
    roomLeaderboard:[],
    isLoading: false,
    isDatabaseLoaded: false,
    isDatabaseAvailable: true,
    isWalletLoaded: false,
    usersWalletAddress: undefined,
    usersProvider: undefined,
    usersChainId: undefined,
    walletProviderApp: WalletApps.Unknown,
    settingsCookie:'',
    isGameLoaded: false,
    
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
    setPlayerState: ( state ) => {
        set( () => ({ playerState: state }))
    },
    setSoundFXVolume: ( volume ) =>{
        set( () => { 
            Cookies.set( CookieSettings.soundFXVolume, `${volume}`, {expires : 356})
            return( {soundFXVolume: volume }) 
        })
    },
    setMusicVolume: ( volume ) =>{
        set( () => {
            Cookies.set( CookieSettings.musicVolume, `${volume}`, {expires : 356})
            return ({ musicVolume: volume })
        })
    },
    setKeyboardLayout: ( layout ) =>{
        set( () => {
            Cookies.set( CookieSettings.keyboardLayout, layout, {expires : 356})
            return({ keyboardLayout: layout })
        })
    },
    initializeUserSettings: () =>{
        set( (state) => {
            let newState = {...state.userShortcuts};
            for (let i = 1; i <= SHORTCUTS; i++) newState[i] = {} as Item;
            const soundFXVolume = Cookies.get( CookieSettings.soundFXVolume );
            const musicVolume = Cookies.get( CookieSettings.musicVolume );
            const keyboardLayout = Cookies.get( CookieSettings.keyboardLayout );
            return( { 
                userShortcuts: newState,
                soundFXVolume: soundFXVolume? +soundFXVolume : 1,
                musicVolume: musicVolume? +musicVolume : 1,
                keyboardLayout: keyboardLayout? keyboardLayout as KeyboardLayouts : KeyboardLayouts.QWERTY,         
             } )
        })
    },
    setUserShortcut: ( id:number , item) => {
        set( (state) => {
            let newState = {...state.userShortcuts};
            //searching and emptying duplicate entries
            let duplicateItemKey =  Object.keys(newState).find( key => newState[key].id === item.id );
            if (duplicateItemKey) newState[duplicateItemKey]= {} as Item; 
            return(
                { userShortcuts: {...newState, [id]:item} }
            )
        })
    },
    setIsDraggingItem: ( state ) =>{
        set( () => ({ isDraggingItem: state }))
    },
    setCountdown: ( time ) => {
        set( () => ({ lobbyCountdown: time }))
    },
    setVitals: ( vital , level) => {
        set( (state) => ({ vitals: { ...state.vitals, [vital]:level } }))
    },
    setExplosives: (key,quantity) => {
        set( (state) => { 
            // auto-assigning a console shortcut if a new explosive is purchased and space is available
            const userShortcuts = {...state.userShortcuts};
            const availableShortcut = Object.keys(userShortcuts).find( shortcutKey => userShortcuts[shortcutKey].id === undefined )
            const savedShortcut = Object.keys(userShortcuts).find( shortcutKey => userShortcuts[shortcutKey].id === +key )
            if ( availableShortcut && savedShortcut === undefined ) {
                const item = state.worldExplosives[+key];
                item.quantity = quantity;
                state.setUserShortcut(+availableShortcut,item)
                console.log(`new shortcut auto-assigned to key ${availableShortcut}`)
            }
            return( 
                {explosives: {...state.explosives, [key]: quantity}}
            ) 
        })
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
        const serverURL =  (process.env.NODE_ENV === 'production') ? `wss://${region.url}` : "ws://localhost:2567";
        Client.getInstance().colyseusClient = new Colyseus.Client( serverURL ) 
        console.log(`Updated server region to URL:${serverURL}`)
    },
    setUsersAavegotchis: (gotchis) => {
        gotchis.length === 0 ? 
            alert(`We couldn't find any gotchis in your wallet, so unfortunately you cannot play😔. Visit www.aavegotchi.com to buy or rent an Aavegotchi if you want to play GotchiMiner.`) 
            : set( () => ({ usersAavegotchis: gotchis }) )
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
        set( () => ({ roomLeaderboard: data }))
    },
    setIsLoading: ( value ) => {
        set( () => ({ isLoading: value }) )
        value ? document.body.style.cursor = 'wait' : document.body.style.cursor = 'default'; 
    },
    setIsDatabaseLoaded: ( value ) =>{
        set( () => ({ isDatabaseLoaded: value }))
    },
    setIsDatabaseAvailable: ( value ) =>{
        set( () => ({ isDatabaseAvailable: value }))
    },
    setIsWalletLoaded: ( value ) =>{
        set( () => ({ isWalletLoaded: value }))
    },
    setIsGameLoaded: ( value ) =>{
        set( () => ({ isGameLoaded: value }))
    },
    setUsersWalletAddress: ( address ) =>{
        set( () => ({ usersWalletAddress: address }))
    },
    setUsersProvider: ( provider ) =>{
        set( () => ({ usersProvider: provider }))
    },
    setUsersChainId: ( chainId ) =>{
        set( () => ({ usersChainId: chainId }))
    },
    setAuthenticatorState: ( state ) =>{
        set( () => ({ authenticatorState: state }))
    },
    setWalletProviderApp: ( state ) =>{
        set( () => ({ walletProviderApp: state }))
    },
    clearUserGameData: () =>{
        set( () => ({ 
            totalValue: 0,
            depth: 0 ,
            vitals : {fuel: 100, health: 100, cargo:0} ,
            cargo: {},
            explosives: {},
            wallet : {},
            worldExplosives: {},  
        }))
    },
    clearUserWeb3Data: () =>{
        set( () => ({ 
            usersChainId: undefined, 
            usersProvider: undefined,
            usersWalletAddress: undefined,
            isWalletLoaded: false,
            walletProviderApp: WalletApps.Unknown,
            authenticatorState: AuthenticatorState.Disconnected,
        }))
    }
}))