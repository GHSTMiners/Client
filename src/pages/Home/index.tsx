//import myGotchi from "assets/images/gotchi_example.png";
import "./App.css";
import styles from "./styles.module.css";
import myGotchi from "assets/images/gotchi_example.png";
import { Card, Col, Row, Container, Modal } from "react-bootstrap";
import GameConfigurator from "components/GameConfigurator";
import { GotchiSelector } from "components";
import { getDefaultGotchi } from "helpers/aavegotchi";
import { useWeb3, updateAavegotchis } from "web3/context";
import { useCallback, useEffect, useState } from "react";
import { AavegotchiObject } from "types";


function LoadingModal () {
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
