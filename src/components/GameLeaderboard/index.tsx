import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import React, { useEffect, useState } from "react";
import { Player } from "matchmaking/Schemas/Player";
import { GotchiSVG } from "components/GotchiSVG";


interface Props {
  hidden: boolean;
}

const GameLeaderboard : React.FC<Props> = ({ hidden }) => {
    
    type IndexedPlayers =  {[key: string]: Player} ;
    type playerObj = {playerId: number, ggems: number };

    const [displayLeaderboard,setDisplayLeaderboard] = useState(!hidden);
    const [players ] = useState<IndexedPlayers>({});
    const [sortedPlayers, setSortedPlayers] = useState<number[]>([]);
    const worldCryptoId: string = Client.getInstance().chiselWorld.world_crypto_id.toString();

    useEffect(()=>{
        Client.getInstance().phaserGame.events.on( "open_leaderboard", ()=> {setDisplayLeaderboard(true); console.log('opening leaderboard')});
        Client.getInstance().phaserGame.events.on("close_leaderboard", ()=> {setDisplayLeaderboard(false); console.log('closing leaderboard') });
        if ( Client.getInstance().colyseusRoom){
            Client.getInstance().colyseusRoom.state.players.onAdd = ( newPlayer, key ) => { players[newPlayer.gotchiID]=newPlayer } ;
            Client.getInstance().colyseusRoom.state.players.onChange = (modPlayer , key )=>{ players[modPlayer.gotchiID]=modPlayer } 
        }
    },[])

    // Hook to sort players depending on their score
    useEffect(()=>{
        // Sorting players ids based on their GGEMS balance
        if (players){
            const unsortedkeys = Object.keys(players);
            let unsortedData: playerObj[] = [];
            unsortedkeys.forEach( playerEntry =>{
                let GGEMS = players[playerEntry].wallet.get(worldCryptoId);
                let id = players[playerEntry].gotchiID;
                let GGEMSbalance = 0;
                if (GGEMS) GGEMSbalance = GGEMS.amount;
                unsortedData.push({playerId:id,ggems:GGEMSbalance})
            })
            const sortedData = unsortedData.sort((entry1,entry2)=> entry2.ggems - entry1.ggems)
            const sortedIds = sortedData.map( entry => entry.playerId);
            setSortedPlayers([...sortedIds]);
        }
    },[displayLeaderboard,players])

    // Upgrade color array for all the defined tiers
    let upgradeColors: string[] = [];
    upgradeColors.push('#7f63ff');
    upgradeColors.push('#33bacc');
    upgradeColors.push('#59bcff');
    upgradeColors.push('#ffc36b');
    upgradeColors.push('#ff96ff');
    upgradeColors.push('#51ffa8');

    function renderUpgradeElement(tier: number, index: number) {
        return (
            <div className={styles.upgradeElement}
                 style={{ backgroundColor: upgradeColors[tier] }}
                 key={`upgradeTier${index}`}>
            </div>
        );
    }

    const renderPlayerInfo = (id:number) => {
        let playerGGEMS = Math.round(players[id].wallet.get(worldCryptoId)?.amount as number);
        const playerRank = sortedPlayers.findIndex( element => element===id) +1 ;
        const playerUpgrades = players[id].upgrades;
        let upgradesBar: JSX.Element[] = [];
        playerUpgrades.forEach( (upgrade,index) => upgradesBar.push(renderUpgradeElement(upgrade.tier,index)) ) ;
    
        return(
        <div className={styles.playerEntry} key={id}>
            <div>
                {playerRank}
            </div>            
            <div className={styles.gotchi}>
                {/*players[id].name*/}
                <div className={styles.gotchiPreviewContainer}>
                <GotchiSVG
                        side={0}
                        tokenId={players[id].gotchiID.toString()}
                        options={{ animate: false, removeBg: true }}
                      />
                </div>
                {players[id].name}
            </div>
            <div>
                {playerGGEMS? playerGGEMS: 0 } 
            </div>
            <div className={styles.upgradeBar}>
                {upgradesBar}
            </div>
        </div>
        )
    }

    return(
    <div className={`${styles.leaderboardContainer} ${displayLeaderboard? styles.displayOn:styles.displayOff}`}>
       
        <div className={styles.tableHeader}>
            <div>Rank</div>
            <div>Gotchi</div>
            <div>GGEMS</div>
            <div>Upgrades</div>
        </div>

        { sortedPlayers.map( (id) =>  renderPlayerInfo(+id)) }

    </div>
    )
};

export default GameLeaderboard;
