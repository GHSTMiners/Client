import { CustomEvents , GameEventList } from "types"

const gameEvents : GameEventList = {
    chat: createEventList('chat'),
    console : createEventList('console'),
    diagnostics: createEventList('diagnostics'),
    dialogs: createEventList('dialogs'),
    exchange: createEventList('exchange'),
    leaderboard : createEventList('leaderboard'),
    menu: createEventList('menu'),
    shop: createEventList('shop')
}

function createEventList (name:string){
    const newCustomEvents : CustomEvents = {
        SHOW: Symbol(`SHOW_${name.toUpperCase}`),
        HIDE: Symbol(`HIDE_${name.toUpperCase}`),
        CHANGE: Symbol(`CHANGE_${name.toUpperCase}_STATE`),
    }
    return newCustomEvents
}

export default gameEvents