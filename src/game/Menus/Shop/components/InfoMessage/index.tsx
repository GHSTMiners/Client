import { useGlobalStore } from 'store'
import styles from './styles.module.css'
import Client from 'matchmaking/Client';

interface Props {
    hidden : boolean
}

const InfoMessage  = ({ hidden }: Props) =>{
    const worldCrypto = useGlobalStore( state => state.worldCrypto);
    const worldCurrency = Client.getInstance().chiselWorld?.world_crypto_id;
    
    return(
        <div className={styles.textContainer} hidden={hidden}>
            <div className={styles.title}>
                Welcome to the Shop!
            </div>
            <div>
                Use your crypto to buy explosives, consumables and upgrades.
            </div>
            <div>
                Convert any crypto to
                <img src={worldCrypto[worldCurrency]?.image} className={styles.coinIcon} alt={'Main World currency'} />
                {worldCrypto[worldCurrency]?.name} by interacting with the top menu bar:
                <ul>
                    <li> Left Click : Sell 1 token </li>
                    <li> Right Click : Sell All tokes </li>
                </ul>
            </div> 
        </div>
    )
}

export default InfoMessage