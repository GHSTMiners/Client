import { AavegotchiObject } from 'types';
import styles from './styles.module.css';

interface Props {
  selectedGotchi?: AavegotchiObject;
}

export const LobbyPanel = ({ selectedGotchi }: Props) => {
    return(
        <div className={styles.lobbyContainer}>
        </div>
    )
}