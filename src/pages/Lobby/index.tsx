import styles from "./styles.module.css";
import { GotchiSVG } from "components";
import { useCallback, useEffect, useState } from "react";
import { updateAavegotchis, useWeb3 } from "web3/context";
import { GotchiSelectorVertical } from "components";
import gotchiLoading from "assets/gifs/loadingBW.gif";


const Lobby = (): JSX.Element => {
  const {
    state: { usersAavegotchis, address, selectedAavegotchiId, networkId },
    dispatch,
  } = useWeb3();


  /**
   * Updates global state with selected gotchi
   */
  const handleSelect = useCallback(
    (gotchiId: string) => {
      dispatch({
        type: "SET_SELECTED_AAVEGOTCHI",
        selectedAavegotchiId: gotchiId,
      });
    },
    [dispatch]
  );

  const [gotchiSide, setGotchiSide] = useState<0 | 1 | 2 | 3>(0);
  const rotateGotchi = () => {
    const currentPos = gotchiSide;
    switch (currentPos) {
      case 0: setGotchiSide(1);  break;
      case 1: setGotchiSide(3);  break;
      case 2: setGotchiSide(0);  break;
      case 3: setGotchiSide(2);  break;
      default: setGotchiSide(0); break;
    }
  };

  useEffect(() => {
    if (address) {
      const prevGotchis = usersAavegotchis || [];
      if (
        prevGotchis.find(
          (gotchi) => gotchi.owner.id.toLowerCase() === address.toLowerCase()
        )
      )
        return;

      dispatch({
        type: "SET_SELECTED_AAVEGOTCHI",
        selectedAavegotchiId: undefined,
      });
      updateAavegotchis(dispatch, address);
    }
  }, [address]);

  return (
    <>
      <div className={styles.basicGrid}>
        <div className={`${styles.gotchiSelection} ${styles.gridTile}`}>
          <div className={styles.gotchiSelectionBar}>
            <GotchiSelectorVertical
                  initialGotchiId={selectedAavegotchiId}
                  gotchis={usersAavegotchis}
                  selectGotchi={handleSelect}
                />
          </div>
          <div className={styles.gotchiPreview}>
            <div className={styles.gotchiContainer} onClick={rotateGotchi}>
                  {selectedAavegotchiId ? (
                    <GotchiSVG
                      side={gotchiSide}
                      tokenId={selectedAavegotchiId}
                      options={{ animate: true, removeBg: true }}
                    />
                  ) : (
                    <img src={gotchiLoading} alt="Loading Aavegotchi" />
                  )}
                </div>
          </div>
          <div className={styles.gotchiTraitsContainer}>Gotchi Traits</div>
          <div className={styles.readyUpContainer}>Ready up button</div>
        </div>
        <div className={`${styles.mapSelection} ${styles.gridTile}`}> Map Selection</div>
        <div className={`${styles.availablePlayers} ${styles.gridTile}`}> Player Available</div>
        <div className={`${styles.chat} ${styles.gridTile}`}> Chat</div>
      </div>
    </>
  );
};

export default Lobby;

