import React, { FormEvent, useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import * as Chisel from "chisel-api-interface";
import { useNavigate } from "react-router-dom";
import Client from "../../matchmaking/Client";
import { World } from "matchmaking/Schemas/World";
import styles from "./styles.module.css";
import { useWeb3 } from "web3/context";
import { RockyCheckbox } from "components";
import GreenButton from "components/GreenButton";

class WorldsOptions extends React.Component {
  state = { data: null };

  componentDidMount() {
    Client.getInstance()
      .apiInterface.worlds()
      .then((worlds) => {
        this.setState({ data: worlds });
      });
  }

  render(): React.ReactNode {
    if (this.state.data !== null) {
      return (this.state.data as unknown as Chisel.World[]).map(function (
        world: Chisel.World
      ) {
        return (
          <option key={world.name} value={world.id}>
            {world.name}
          </option>
        );
      });
    }

    return <option value="0"></option>;
  }
}

const CreateGameForm = (): JSX.Element => {
  let navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const {
    state: { address, networkId, loading },
    dispatch,
  } = useWeb3();

  function createGame(event: FormEvent<HTMLElement>) {
    setLoading(true);
    event.preventDefault();
    // @ts-ignore: Unreachable code error
    // prettier-ignore
    Client.getInstance().apiInterface.world(event.target.world.value).then(world =>{
            Client.getInstance().chiselWorld = world;
            Client.getInstance().authenticationInfo.chainId = Client.getInstance().authenticator.chainId().toString()
            Client.getInstance().authenticationInfo.walletAddress = Client.getInstance().authenticator.currentAccount()
            Client.getInstance().authenticationInfo.authenticationToken = Client.getInstance().authenticator.token()
            
            // @ts-ignore: Unreachable code error
            // prettier-ignore
            Client.getInstance().colyseusClient.create<World>(`${world.id}_${event.target.gameMode.value}`, Client.getInstance().authenticationInfo).then(room => {
                room.onStateChange.once((state) => {
                    Client.getInstance().colyseusRoom = room;
                    navigate("/play", {replace: false});
                    setLoading(false);
                });
            }).catch(e =>{
                setLoading(false);
                alert(`Failed to create game! Reason: ${e.message}`)
            })
        }).catch(e =>{
            setLoading(false);
            alert("Failed to fetch world information! Maybe we're having server issues ?")
        })
  }

  return (
    <Form noValidate onSubmit={(e) => createGame(e)}>
      <Form.Group className="mb-3" controlId="world">
        <Form.Label>World</Form.Label>
        <div className={styles.selectorContainer}>
          <Form.Select
            aria-label="World"
            disabled={isLoading}
            className={styles.customSelect}
          >
            <WorldsOptions />
          </Form.Select>
        </div>
      </Form.Group>
      <Form.Group className="mb-3" controlId="gameMode">
        <Form.Label>Game Mode</Form.Label>
        <div className={styles.selectorContainer}>
          <Form.Select
            aria-label="World"
            disabled={isLoading}
            className={styles.customSelect}
          >
            <option value="Classic">Classic</option>
          </Form.Select>
        </div>
      </Form.Group>
      <div className={styles.createGameBottom}>
        <Form.Group className="mb-3" controlId="private-game">
          <Form.Label>Options</Form.Label>
          <RockyCheckbox textLabel="Private Game" />
          {/*<Form.Check type="checkbox" label="Private game" disabled={isLoading} />*/}
        </Form.Group>
        <GreenButton disabled={isLoading}>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            hidden={!isLoading}
          />
          {isLoading ? " Initializing" : "Create game"}
        </GreenButton>
        {/*
        <div className={styles.fuelGauge}>
          <div className={styles.fuelBarContainer}>
            <div className={styles.fuelBar} />
          </div>
        </div>
  */}
      </div>
    </Form>
  );
};

const JoinGameForm = (): JSX.Element => {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="room-id">
        <Form.Label>Room code</Form.Label>
        <Form.Control type="text" aria-label="room-code"></Form.Control>
      </Form.Group>
      <div className={styles.joinButtonContainer}>
        <GreenButton>Join room</GreenButton>
        <p></p>
        {/*<JoinRandomGameForm />*/}
      </div>
    </Form>
  );
};

const JoinRandomGameForm = (): JSX.Element => {
  let navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const {
    state: { address, networkId, loading },
    dispatch,
  } = useWeb3();

  function joinRandomGame(event: FormEvent<HTMLElement>) {
    event.preventDefault();
    setLoading(true);
    Client.getInstance()
      .colyseusClient.getAvailableRooms()
      .then((rooms) => {
        if (rooms.length === 0) {
          alert("Cannot find an empty game, please create your own!");
          setLoading(false);
        } else {
          Client.getInstance().authenticationInfo.chainId = Client.getInstance().authenticator.chainId().toString()
          Client.getInstance().authenticationInfo.walletAddress = Client.getInstance().authenticator.currentAccount()
          Client.getInstance().authenticationInfo.authenticationToken = Client.getInstance().authenticator.token()

          Client.getInstance()
            .colyseusClient.joinById<World>(
              rooms[0].roomId,
              Client.getInstance().authenticationInfo
            )
            .then((room) => {
              Client.getInstance().colyseusRoom = room;
              room.onStateChange.once((state) => {
                console.log(state.id);
                Client.getInstance()
                  .apiInterface.world(state.id)
                  .then((world) => {
                    Client.getInstance().chiselWorld = world;
                    navigate("/play", { replace: false });
                    setLoading(false);
                  })
                  .catch((e) => {
                    setLoading(false);
                    alert(`Failed to create game! Reason: ${e.message}`)

                  });
              });
            })
            .catch((e) => {
              setLoading(false);
              alert(`Failed to create game! Reason: ${e.message}`)
            })
            .catch((e) => {
              setLoading(false);
              alert(`Failed to create game! Reason: ${e.message}`)
            });
        }
      });
  }
  return (
    <Form noValidate onSubmit={(e) => joinRandomGame(e)}>
      <Form.Group className="mb-3" controlId="room-id">
        <Form.Label>Room code</Form.Label>
        <Form.Control
          type="text"
          aria-label="room-code"
          className={styles.roomLabel}
        ></Form.Control>
      </Form.Group>
      <div className={styles.joinButtonContainer}>
        <GreenButton>Join room</GreenButton>
        <p></p>
        <GreenButton disabled={isLoading || !address}>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
            hidden={!isLoading}
          />
          {isLoading ? " Joining..." : "Random Game"}
        </GreenButton>
      </div>
    </Form>
  );
};

const GameConfigurator = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.createGameRock}>
        <div className={styles.createGameText}>
          <div className={styles.stoneTitles}>Create Game</div>
          <CreateGameForm />
        </div>
      </div>

      <div className={styles.joinGameRock}>
        <div className={styles.joinGameText}>
          <div className={styles.stoneTitles}>Join existing game</div>
          <JoinRandomGameForm />
        </div>
      </div>
    </div>
  );
};

export default GameConfigurator;

// TO DO: INTEGRATE THE JoinRandomGameForm button into the JoinGameForm
/*<Card className="mt-3">
        <Card.Header>Join random game</Card.Header>
        <Card.Body>
          <JoinRandomGameForm />
        </Card.Body>
      </Card>
      */
