import { useEffect, useState } from "react";
import globalStyles from "theme/globalStyles.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Hamburger, SideTray } from "components";
import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import PlayButton from "components/PlayButton";
import RedButton from "components/RedButton";
import * as Schema from "matchmaking/Schemas";
import gameEvents from "game/helpers/gameEvents";
import RegionSelection from "components/RegionSelection";
import { endedGameMessage } from "types";
import { useGlobalStore } from "store";
import temporarilyClosed from "assets/images/temporarily_closed.png" 
import WalletButton from "components/WalletButton";



export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigator = useNavigate();
  const inLobby = location.pathname === "/lobby";
  const inEndgame = location.pathname.includes("/endgame");
  const inGame = location.pathname === "/play";
  const isLoading = useGlobalStore( state => state.isLoading );
  const setIsLoading = useGlobalStore( state => state.setIsLoading )
  const serverRegion = useGlobalStore( state => state.region );
  const usersAavegotchis = useGlobalStore( state => state.usersAavegotchis)
  const isWalletLoaded = useGlobalStore( state => state.isWalletLoaded)

  const routeToLobby = () => {
    setIsLoading(true)
    console.log(`Trying join the lobby in the server region ${serverRegion.name}; URL: ${serverRegion.url}`)
    Client.getInstance().colyseusClient.joinOrCreate<Schema.Lobby>("Lobby").then(room => {
      console.log(`Joined lobby room`)
      setIsLoading(false)
      Client.getInstance().lobbyRoom = room 
      Client.getInstance().lobbyRoom.onLeave(code => {
        console.log(`Left the lobby room with code: ${code}`)
      })
      navigator('/lobby')
    }).catch(exception => {
      setIsLoading(false)
      alert(`Failed to join a lobby, maybe we're having server issues ?`)
      console.log('Failed to join the lobby. Reason:')
      console.log(exception)
    })
   }

   const routeToHome = () => {
    if(Client.getInstance().lobbyRoom) {
      Client.getInstance().lobbyRoom.leave(true)
    }
    navigator('/')
   }

   useEffect(()=>{ 
    const routeToEndgame = ( parameters: endedGameMessage ) => {
      navigator(`/endgame/${parameters.roomId}/${parameters.gotchiId}`)
     }

     Client.getInstance().phaserGame?.events.on( gameEvents.game.END, routeToEndgame)

     return () =>{
      Client.getInstance().phaserGame?.events.off( gameEvents.game.END, routeToEndgame)
     }
   },[navigator])
 
  let serversOnline = (process.env.NODE_ENV === 'development') ? true: false;

  return (
    <header className={`${styles.header} ${isLoading? globalStyles.isLoading :null}`} hidden = { inGame } >
      <nav
        className={`${globalStyles.container} ${styles.desktopHeaderContent}`}
      >
        <ul className={styles.navContainer}>
          <NavLink to="/">
            <div className={styles.logo}></div>
          </NavLink>

          <NavLink hidden = { inLobby || inEndgame }
            to="/"
            className={({ isActive }) =>
              isActive ? styles.activeNavLink : styles.navLink
            } 
            end>
            Home
          </NavLink>
          
          <NavLink hidden = { inLobby || inEndgame }
            to="/leaderboard"
            className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
          >
            Leaderboard
          </NavLink>
          <NavLink hidden = { inLobby || inEndgame }
            to="/howtoplay"
            className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
          >
            How to Play
          </NavLink> 
          <NavLink hidden = { inLobby || inEndgame }
            to="/about"
            className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
          >
            About
          </NavLink>
          
        </ul>
        {/*<WalletButton />*/}
        
        <div className={styles.playButtonContainer} hidden = { inLobby || inEndgame}> 

          <div className={styles.playWrapper} hidden={!isWalletLoaded }>
          {serversOnline? 
            <> 
              <PlayButton 
                width={'15rem'} 
                fontSize={'2rem'} 
                onClick={ (usersAavegotchis.length===0) ? ()=>alert('😔No gotchis found in your wallet'): routeToLobby} />
              <RegionSelection />
            </>
            : <img src={temporarilyClosed} style={{height: '7.3rem', marginTop: '0.6rem' }} alt={'Temporarily closed'}/> }
          </div>
          <WalletButton />
        </div>

        <div className={styles.playButtonContainer} hidden = { !( inLobby || inEndgame ) }> 
          <RedButton width={'15rem'} fontSize={'2rem'} onClick={routeToHome}>EXIT</RedButton>
        </div>


      </nav>
        
      <div className={styles.mobileHeaderContent}>
        <div className={styles.playButtonContainer} hidden = { inLobby || inEndgame }> 
        {serversOnline? 
            <> 
              <PlayButton 
                width={'15rem'} 
                fontSize={'2rem'} 
                onClick={ (usersAavegotchis.length===0) ? ()=>alert('😔No gotchis found in your wallet'): routeToLobby} />
              <RegionSelection />
            </>
            : <img src={temporarilyClosed} style={{height: '7.3rem', marginTop: '0.6rem' }} alt={'Temporarily closed'}/> }
        </div>

        <div className={styles.playButtonContainer} hidden = { !( inLobby || inEndgame ) }> 
          <RedButton width={'15rem'} fontSize={'2rem'} onClick={routeToHome}>EXIT</RedButton>
        </div>

        <Hamburger onClick={() => setMenuOpen((prevState) => !prevState)} />
        <SideTray open={menuOpen}>
          <nav>
            <WalletButton />
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
            >
              Home
            </NavLink>
            <NavLink 

              to="/leaderboard"
              className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
            >
              Leaderboard
            </NavLink>
            <NavLink
              to="/howtoplay"
              className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
            >
              How to Play
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
            >
              About
            </NavLink>
          </nav>
        </SideTray>
      </div>
      : ''
    </header>
  );
};
