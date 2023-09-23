import { IndexedCrypto, IndexedPlayers } from "types";
import styles from "../styles.module.css";
import renderUpgradeElement from "./renderUpgradeElement";

const renderPlayerInfo = (id:number,players:IndexedPlayers,sortedPlayers:number[],worldCrypto:IndexedCrypto, gotchiSVG:string) => {
    let totalCrypto = 0;
    players[id].wallet.forEach( entry => totalCrypto = entry.amount * worldCrypto[entry.cryptoID].price + totalCrypto );
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
            <div className={styles.gotchiPreviewContainer}>
                <img src={gotchiSVG} className={styles.gotchiPreviewContainer} alt={`Gotchi${id}`}/>
            </div>
            {players[id].name}
        </div>
        <div>
            {Math.round(totalCrypto*10)/10} 
        </div>
        <div className={styles.upgradeBar}>
            {upgradesBar}
        </div>
    </div>
    )
}

export default renderPlayerInfo