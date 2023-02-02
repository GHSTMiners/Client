import useCooldown from "hooks/useCooldown";
import styles from "./styles.module.css"

interface Props {
    deadline: Date, 
    itemCooldown: number
  }

const ButtonCooldown : React.FC<Props> = ({deadline, itemCooldown} ) => {
    const [secondsLeft, cooldownProgress]=useCooldown(deadline,itemCooldown);

    return(
        <>
            <div className={styles.cooldownContainer} 
                style={{background:`conic-gradient(rgba(0, 0, 0, 0) ${cooldownProgress}%,rgba(126,240,159,0.8)  0)`}}
                hidden={(secondsLeft<=0)}>
            </div>
        </>
    )
}

export default ButtonCooldown