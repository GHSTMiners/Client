import { useEffect, useState } from "react";
import globalStyles from "theme/globalStyles.module.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useWeb3, connectToNetwork } from "web3/context";
import { smartTrim } from "helpers/functions";
import { networkIdToName } from "helpers/vars";
//import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { Hamburger, SideTray } from "components";
//import { playSound } from 'helpers/hooks/useSound';
import styles from "./styles.module.css";
import Client from "matchmaking/Client";
import GreenButton from "components/GreenButton";
import RedButton from "components/RedButton";


const WalletButton = () => {
  const {
    state: { address, networkId, loading },
    dispatch,
  } = useWeb3();


  const handleWalletClick = () => {
    if (!address) {
      //playSound('click');
      if(!loading) Client.getInstance().authenticator.authenticate(dispatch)
    }
  };

  useEffect(() => {
    Client.getInstance().authenticator.authenticate(dispatch)
    // Update the document title using the browser API
  }, []);

  return (
    <button
      className={styles.walletContainer}
      onClick={handleWalletClick}
      disabled={!!address}
    >
      {loading ? (
        "Loading..."
      ) : address ? (
        <div className={styles.walletAddress}>
          {/* <Jazzicon diameter={24} seed={jsNumberForAddress(address)} /> //this was commented to avoid problems */}
          <div className={styles.connectedDetails}>
            <p>{networkId ? networkIdToName[networkId] : ""}</p>
            <p>{smartTrim(address, 8)}</p>
          </div>
        </div>
      ) : (
        "Connect"
      )}
    </button>
  );
};

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigator = useNavigate();
  
  const routeToLobby = () => {
    navigator('/lobby')
   }

   const routeToHome = () => {
    navigator('/')
   }

  return (
    <header className={styles.header} hidden = {location.pathname === "/play"  } >
      <nav
        className={`${globalStyles.container} ${styles.desktopHeaderContent}`}
      >
        <ul className={styles.navContainer}>
          <NavLink to="/">
            <div className={styles.logo}></div>
          </NavLink>

          <NavLink hidden = {location.pathname === "/lobby"}
            to="/"
            className={({ isActive }) =>
              isActive ? styles.activeNavLink : styles.navLink
            }
          >
            Home
          </NavLink>
          
          <NavLink hidden = {location.pathname === "/lobby"}
            to="/game"
            className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
          >
            Game
          </NavLink>
          <NavLink hidden = {location.pathname === "/lobby"}
            to="/leaderboard"
            className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
          >
            Leaderboard
          </NavLink>
          <NavLink hidden = {location.pathname === "/lobby"}
            to="/howtoplay"
            className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
          >
            How to Play
          </NavLink> 
          <NavLink hidden = {location.pathname === "/lobby"}
            to="/about"
            className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
          >
            About
          </NavLink>
          
        </ul>
        {/*<WalletButton />*/}
        <div className={styles.playButtonContainer} hidden = {location.pathname === "/lobby"}> 
          <GreenButton width={'15rem'} fontSize={'2rem'} onClick={routeToLobby}>PLAY</GreenButton>
        </div>

        <div className={styles.playButtonContainer} hidden = {location.pathname !== "/lobby"}> 
          <RedButton width={'15rem'} fontSize={'2rem'} onClick={routeToHome}>EXIT</RedButton>
        </div>
      </nav>
        
      <div className={styles.mobileHeaderContent}>
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
            to="/game"
            className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
          >
            Game
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
              Settings
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
