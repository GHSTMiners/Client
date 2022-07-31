import { GotchiSVG } from "components/GotchiSVG";
import styles from "./styles.module.css";
import TopPlayersIcon2 from "assets/icons/top_players.svg"

interface Props {
  title?: string;
  icon?: string; 
}

export const DailyWinners = ({
    title="Daily Top Players",
    icon
  }: Props) => {

    const renderGotchi = (tokenId:string,name:string,score:number)=>{

      return(
        <div className={styles.playerContainer}>
          <div className={styles.gotchiContainer}>
            <GotchiSVG tokenId={tokenId}  options={{ animate: true, removeBg: true }} />
          </div>
          <div className={styles.gotchiName}>{name}</div>
          <div className={styles.gotchiScore}>{score}</div>
        </div>
      )
    }

    return (
      <div className={styles.infoPanel}>
          <div className={styles.tileHeader}>
            <div className={styles.infoTitle}> {title} </div>
            <img src={TopPlayersIcon2} className={styles.tileIcon} alt={'Daily Winers Icon'}/> 
          </div>
          <select className={styles.selectCathegory}> 
            <option>Blocks Mined</option>
          </select>
          <div className={styles.winnersContainer}>
            {renderGotchi('20689','Voyager',2531)}
            {renderGotchi('21223','Corleone',1956)}
            {renderGotchi('3934','Yoda',1623)}
          </div>
      </div>
    );
  };
  