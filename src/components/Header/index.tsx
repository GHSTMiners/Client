import { useEffect, useState } from "react";
import globalStyles from "theme/globalStyles.module.css";
import { NavLink } from "react-router-dom";
import { useWeb3, connectToNetwork } from "web3/context";
import { smartTrim } from "helpers/functions";
import { networkIdToName } from "helpers/vars";
//import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { Hamburger, SideTray } from "components";
//import { playSound } from 'helpers/hooks/useSound';
import styles from "./styles.module.css";
import Client from "matchmaking/Client";


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

  return (
    <header className={styles.header}>
      <nav
        className={`${globalStyles.container} ${styles.desktopHeaderContent}`}
      >
        <ul className={styles.navContainer}>
          <NavLink to="/">
            <div className={styles.logo}></div>
          </NavLink>
          <NavLink
            to="/"
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
        </ul>
        <WalletButton />
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
    </header>
  );
};
