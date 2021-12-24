//import myGotchi from "assets/images/gotchi_example.png";
import "./App.css";
import styles from "./styles.module.css";
import myGotchi from "assets/images/gotchi_example.png";
import { Card, Col, Row, Container, Modal, Button } from "react-bootstrap";
import GameConfigurator from "components/GameConfigurator";
import { GotchiSelector, GotchiSVG } from "components";
import { getDefaultGotchi } from "helpers/aavegotchi";
import { useWeb3, updateAavegotchis, connectToNetwork } from "web3/context";
import { useCallback, useEffect, useState } from "react";
import { AavegotchiObject } from "types";
import { networkIdToName } from "helpers/vars";
import { smartTrim } from "helpers/functions";
import gotchiLoading from "assets/gifs/loading.gif";
import bgImage from "assets/images/bg.png";
import { Header } from "components";
import { StoneMenu } from "assets";

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
              <div className="row justify-content-center">
                <div className={styles.gotchiContainer}>
                  {selectedAavegotchiId ? (
                    <GotchiSVG
                      tokenId={selectedAavegotchiId}
                      options={{ animate: true, removeBg: true }}
                    />
                  ) : (
                    <img src={gotchiLoading} alt="Loading Aavegotchi" />
                  )}
                </div>
                <StoneMenu className={styles.stoneMenu} />
              </div>

              <div className={styles.selectorContainer}>
                <GotchiSelector
                  initialGotchiId={selectedAavegotchiId}
                  gotchis={usersAavegotchis}
                  selectGotchi={handleSelect}
                />
              </div>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Home;
