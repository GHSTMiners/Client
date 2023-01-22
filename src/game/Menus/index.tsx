import Leaderboard from "./Leaderboard"
import Settings from "./Settings"
import Shop from "./Shop"

const Menus = () => {
    return(
        <>
            <Shop />
            <Settings />
            <Leaderboard hidden={true} />
        </>
    )
}

export default Menus