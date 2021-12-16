//import myGotchi from "assets/images/gotchi_example.png";
import "./App.css";
import styles from "./styles.module.css";
import myGotchi from "assets/images/gotchi_example.png";
import { Card, Col, Row, Container, Modal, Button } from "react-bootstrap";
import GameConfigurator from "components/GameConfigurator";
import { GotchiSelector } from "components";
import { getDefaultGotchi } from "helpers/aavegotchi";
import { useWeb3, updateAavegotchis, connectToNetwork } from "web3/context";
import { useCallback, useEffect, useState } from "react";
import { AavegotchiObject } from "types";
import { networkIdToName } from "helpers/vars";
import { smartTrim } from "helpers/functions";

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

  const WalletButton = () => {
    const {
      state: { address, networkId, loading },
      dispatch,
    } = useWeb3();

    const handleWalletClick = () => {
      if (!address) {
        //playSound('click');
        console.log(address?.toString);
        connectToNetwork(dispatch, window.ethereum);
      }
    };

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
      <Container fluid>
        <Row>
          <Col>
            <WalletButton />
            <div className={styles.selectorContainer}>
              <GotchiSelector
                initialGotchiId={selectedAavegotchiId}
                gotchis={usersAavegotchis}
                selectGotchi={handleSelect}
              />
            </div>
          </Col>
          <Col>
            <GameConfigurator />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
