import styles from "./styles.module.css";
import { SpinnerCircular } from 'spinners-react';

interface Props {
  title: string;
  quantity: string | number | undefined;
  icon?:string;
  loading:boolean; 
  description?: string;
}

export const InfoPanel = ({
    title,
    quantity,
    icon,
    loading,
    description
  }: Props) => {
    return (
      <div className={styles.infoPanel}>
          <div className={styles.tileHeader}>
            <div className={styles.infoTitle}> {title} </div>
            { icon? <img src={icon} className={styles.tileIcon} alt={title}/> : ''}
          </div>
          <div className={styles.infoQuantity}> 
            {loading? <SpinnerCircular color={'ffffff'}/> : quantity} 
          </div>
      </div>
    );
  };
  