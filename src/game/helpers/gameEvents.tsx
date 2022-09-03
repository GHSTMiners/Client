import { CustomEvents , GameEventList } from "types"

const gameEvents : GameEventList = {
    buildings: { EXIT: Symbol('EXITED_BUILDING')},
    chat: {...createDisplayEvent('chat'), ANNOUNCEMENT: Symbol('SYSTEM_MESSAGE'), MESSAGE: Symbol('CHAT_MESSAGE')},
    console : { ...createDisplayEvent('console'),  
                    SHORTCUT: Symbol('USED_SHORTCUT') 
                },
    diagnostics: {...createDisplayEvent('diagnostics'), 
                    START: Symbol('START_POLLING'), 
                    STOP: Symbol('STOP_POLLING'),
                    LATENCY: Symbol('NEW_LATENCY')
                },
    dialogs: createDisplayEvent('dialogs'),
    exchange: createDisplayEvent('exchange'),
    game: { MINEDCRYSTAL: Symbol('MINED_CRYSTAL'), 
            LOSTCARGO: Symbol('LOST_CARGO') },
    leaderboard : createDisplayEvent('leaderboard'),
    menu: createDisplayEvent('menu'),
    phaser: { MAINSCENE: Symbol('MAINSCENE_LOADED'), 
              LOADING: Symbol('LOADING') 
            },
    refinary: { REFINE: Symbol('REFINING_CARGO')},
    room: { JOINED: Symbol('JOINED_GAME') },
    shop: { ...createDisplayEvent('shop'), UPGRADED:Symbol('UPGRADED_TIER') },
    vitals: { LOWFUEL: Symbol('LOW_FUEL')},
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