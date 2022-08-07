import { GotchiSVG } from "components/GotchiSVG";
import { IndexedPlayers } from "types";
import styles from "../styles.module.css"
import Client from "matchmaking/Client";
import renderUpgradeElement from "./renderUpgradeElement";

const renderPlayerInfo = (id:number,players:IndexedPlayers,sortedPlayers:number[]) => {
    
    const worldCryptoId: string = Client.getInstance().chiselWorld.world_crypto_id.toString();
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

export default renderPlayerInfo