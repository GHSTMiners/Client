import { CustomEvents , GameEventList } from "types"

const gameEvents : GameEventList = {
    chat: createDisplayEvent('chat'),
    console : createDisplayEvent('console'),
    diagnostics: createDisplayEvent('diagnostics'),
    dialogs: createDisplayEvent('dialogs'),
    exchange: createDisplayEvent('exchange'),
    leaderboard : createDisplayEvent('leaderboard'),
    menu: createDisplayEvent('menu'),
    room: { JOINED: Symbol('JOINED_GAME') },
    shop: createDisplayEvent('shop'),
    wallet: { ADDED: Symbol('ADDED_CRYPTO'), 
              UPDATED: Symbol('UPDATED_CRYPTO')
            }
}

function createDisplayEvent (name:string){
    const newDisplayEvents : CustomEvents = {
        SHOW: Symbol(`SHOW_${name.toUpperCase}`),
        HIDE: Symbol(`HIDE_${name.toUpperCase}`),
        CHANGE: Symbol(`CHANGE_${name.toUpperCase}_STATE`),
    }
    return newDisplayEvents
}

export default gameEvents