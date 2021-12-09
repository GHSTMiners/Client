import React from "react";
import { Button, Card, Container, Form, InputGroup, Row } from "react-bootstrap";
import { createGame, joinRandomGame } from "./functions";
import {APIInterface, World} from "chisel-api-interface"

class WorldsOptions extends React.Component {
    state = {data : null}

    componentDidMount() {
        let apiInterface : APIInterface = new APIInterface('https://chisel.gotchiminer.rocks/api');
        apiInterface.worlds().then(worlds => {
            console.log(worlds);
            this.setState({data: worlds});
        })
    }

    render(): React.ReactNode {
        if(this.state.data !== null) {
            return (this.state.data as unknown as World[]).map(function(world:World) {
                return <option value={world.name}>{world.name}</option>
            })
        }
        
        return (
            <option value="0"></option>
        )
    }
}

const CreateGameForm = (): JSX.Element => {
    return (
        <Form noValidate onSubmit={(e) => createGame(e)}>
            <Form.Group className="mb-3" controlId="world">
                <Form.Label>World</Form.Label>
                <Form.Select aria-label="World">
                    <WorldsOptions/>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="gameMode">
                <Form.Label>Game Mode</Form.Label>
                <Form.Select aria-label="World">
                    <option value="Classic">Classic</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="private-game">
                <Form.Label>Options</Form.Label>        
                <Form.Check type="checkbox" label="Private game" />
            </Form.Group>       
            <Button variant="primary" type="submit">
                Create game
            </Button>
        </Form>
    )
}

const JoinGameForm = (): JSX.Element => {
    return (
        <Form>
            <Form.Group className="mb-3" controlId="room-id">
                <Form.Label>Room code</Form.Label>
                <Form.Control type="text" aria-label="room-code">        
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Join game
            </Button>
        </Form>
    )
}

const JoinRandomGameForm = (): JSX.Element => {
    return (
        <Form>
            <Button variant="primary" onClick={joinRandomGame}>
                Join random game
            </Button>
        </Form>
    )
}

const GameConfigurator = (): JSX.Element => {
    return (
        <div>
            <Card className="mt-3">
                <Card.Header>Create a game</Card.Header>
                <Card.Body>
                    <CreateGameForm/>
                </Card.Body>
            </Card>
            <Card className="mt-3">
                <Card.Header>Join existing game</Card.Header>
                <Card.Body>
                    <JoinGameForm/>
                </Card.Body>
            </Card>
            <Card className="mt-3">
                <Card.Header>Join random game</Card.Header>
                <Card.Body>
                    <JoinRandomGameForm/>
                </Card.Body>
            </Card>
        </div>
    );
};

export default GameConfigurator;