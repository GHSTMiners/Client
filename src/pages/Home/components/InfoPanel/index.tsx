import styles from "./styles.module.css";
import { SpinnerCircular } from 'spinners-react';

interface Props {
  title: string;
  quantity: number | undefined;
  dollarLabel?: boolean;
  icon?:string;
  loading:boolean; 
  description?: string;
}

export const InfoPanel = ({
    title,
    quantity,
    dollarLabel= false,
    icon,
    loading,
    description
  }: Props) => {

    function formatQuantity(quantity:number | undefined):string{
      let formattedLabel:string = `${quantity}` 
      if (quantity){
        if (quantity>=1000000) formattedLabel = `${Math.floor(quantity/1000000)}.${Math.round((quantity%1000000)/100000)} M`
        if (quantity<1000000 && quantity>=1000 ) formattedLabel = `${Math.floor(quantity/1000)}.${Math.round((quantity%1000)/100)} K`
        if (dollarLabel) formattedLabel =`$ ${formattedLabel}`
      }
      return formattedLabel;
    }
    return (
      <div className={styles.infoPanel}>
          <div className={styles.tileHeader}>
            <div className={styles.infoTitle}> {title} </div>
            { icon? <img src={icon} className={styles.tileIcon} alt={title}/> : ''}
          </div>
          <div className={styles.infoQuantity}> 
            {loading? <SpinnerCircular color={'ffffff'}/> : formatQuantity(quantity)} 
          </div>
      </div>
    );
  };
  