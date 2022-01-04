//import myGotchi from "assets/images/gotchi_example.png";
import "./App.css";
import styles from "./styles.module.css";
import { Card, Col, Row, Container, Modal, Button } from "react-bootstrap";
import GameConfigurator from "components/GameConfigurator";
import { GotchiSelector, GotchiSVG } from "components";
import { getDefaultGotchi } from "helpers/aavegotchi";
import { useWeb3, updateAavegotchis } from "web3/context";
import { useCallback, useEffect, useState } from "react";
import gotchiLoading from "assets/gifs/loading.gif";
import { Header } from "components";
import { RotateIcon } from "assets";
import { TraitsPanel } from "components/TraitsPanel";

function LoadingModal() {
  return (
    <Modal>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
    </Modal>
  );
}

const Home = (): JSX.Element => {
  const {
    state: { usersAavegotchis, address, selectedAavegotchiId, networkId },
    dispatch,
  } = useWeb3();
  const callDefaultGotchi = () => {
    dispatch({
      type: "SET_USERS_AAVEGOTCHIS",
      usersAavegotchis: [getDefaultGotchi()],
    });
  };

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
    //connectToNetwork(dispatch, window.ethereum);

    if (process.env.REACT_APP_OFFCHAIN) return callDefaultGotchi();

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
        <Header />
        <Container fluid>
          <Row>
            <Col>
              <div className={styles.gotchiTraitsContainer}>
                <div className={styles.stoneMenu}>
                  <TraitsPanel
                    selectedGotchi={usersAavegotchis?.find(
                      (gotchi) => gotchi.id === selectedAavegotchiId
                    )}
                  />
                </div>
                <div className={styles.gotchiContainer}>
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

              <button className={styles.rotateButton}>
                <RotateIcon width={32} height={24} onClick={rotateGotchi} />
              </button>

              <div className={styles.selectorContainer}>
                <GotchiSelector
                  initialGotchiId={selectedAavegotchiId}
                  gotchis={usersAavegotchis}
                  selectGotchi={handleSelect}
                />
              </div>
            </Col>
            <Col>
              <GameConfigurator></GameConfigurator>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Home;
