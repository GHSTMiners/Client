//import myGotchi from "assets/images/gotchi_example.png";
import styles from "./styles.module.css";
import GameConfigurator from "components/GameConfigurator";
import { GotchiSelector, GotchiSVG } from "components";
import { useWeb3, updateAavegotchis } from "web3/context";
import { useCallback, useEffect, useState } from "react";
import gotchiLoading from "assets/gifs/loading.gif";
import { Header } from "components";
import { TraitsPanel } from "components/TraitsPanel";
import RockySelect from "components/RockySelect";


const Home = (): JSX.Element => {
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
      case 0:
        setGotchiSide(1);
        break;
      case 1:
        setGotchiSide(3);
        break;
      case 2:
        setGotchiSide(0);
        break;
      case 3:
        setGotchiSide(2);
        break;
      default:
        setGotchiSide(0);
        break;
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

  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div className={styles.backgroundContainer}>
        
        <div className={styles.homeContainer}>
          <div className={styles.gotchiMainContainer}>
            <div className={styles.gotchiTraitsContainer}>
              <div className={styles.stoneMenu}>
                <TraitsPanel
                  selectedGotchi={usersAavegotchis?.find(
                    (gotchi) => gotchi.id === selectedAavegotchiId
                  )}
                />
              </div>
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

            <div className={styles.selectorContainer}>
              <GotchiSelector
                initialGotchiId={selectedAavegotchiId}
                gotchis={usersAavegotchis}
                selectGotchi={handleSelect}
              />
            </div>
          </div>
          <div className={styles.gameConfigContainer}>
            <GameConfigurator />
            {/*<RockySelect />*/}
          </div>
        </div>
      </div>
    </>
  );
};
//<RockyCheckbox textLabel="Test"/>
export default Home;
