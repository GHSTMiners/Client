import { SpinnerCircular } from "spinners-react"
import { useGlobalStore } from "store"
import styles from "./styles.module.css"

const LoadingModal = () =>{
    const isLoading = useGlobalStore( state => state.isLoading );
    return(
        <div className={styles.loadingContainer} hidden={!isLoading}>
        <SpinnerCircular color={'ffffff'}/>Joining Lobby... 
      </div>
    )
}

export default LoadingModal