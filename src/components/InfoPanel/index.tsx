import styles from "./styles.module.css";

interface Props {
  title: string;
  quantity: string;
  icon?:string; 
  description?: string;
}

export const InfoPanel = ({
    title,
    quantity,
    icon,
    description
  }: Props) => {
    return (
      <div className={styles.infoPanel}>
          <div className={styles.tileHeader}>
            <div className={styles.infoTitle}> {title} </div>
            { icon? <img src={icon} className={styles.tileIcon}/> : ''}
          </div>
          <div className={styles.infoQuantity}> {quantity} </div>
          <div className={styles.infoTitle} > </div>
      </div>
    );
  };
  