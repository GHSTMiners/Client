import styles from "./styles.module.css"

interface Props {
    secondsLeft: number, 
    cooldownProgress: number
  }

const ButtonCooldown : React.FC<Props> = ({secondsLeft, cooldownProgress} ) => {
    
    return(
        <>
            <div className={styles.cooldownContainer} 
                style={{background:`conic-gradient(rgba(0, 0, 0, 0) ${cooldownProgress}%,rgba(204,255,254,0.8)  0)`}}
                hidden={(secondsLeft<=0)}>
                    {secondsLeft}
            </div>
        </>
    )
}

export default ButtonCooldown