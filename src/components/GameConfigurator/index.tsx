import React, { FormEvent, useState } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import * as Chisel from "chisel-api-interface"
import { useNavigate } from "react-router-dom";
import Client from "../../matchmaking/Client"
import {World} from "matchmaking/Schemas/World"

class WorldsOptions extends React.Component {
    state = {data : null}

    componentDidMount() {
        Client.getInstance().apiInterface.worlds().then(worlds => {
            this.setState({data: worlds});
        })
    }

    render(): React.ReactNode {
        if(this.state.data !== null) {
            return (this.state.data as unknown as Chisel.World[]).map(function(world:Chisel.World) {
                return <option key={world.name} value={world.id}>{world.name}</option>
            })
        }
        
        return (
            <option value="0"></option>
        )
    }
}

const CreateGameForm = (): JSX.Element => {
    let navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);

    function createGame(event: FormEvent<HTMLElement>) {
        setLoading(true);
        event.preventDefault();
        try{
            // @ts-ignore: Unreachable code error
            Client.getInstance().apiInterface.world(event.target.world.value).then(world =>{
                Client.getInstance().chiselWorld = world;
                // @ts-ignore: Unreachable code error
                Client.getInstance().colyseusClient.create<World>(`${world.name}_${event.target.gameMode.value}`).then(room => {
                    Client.getInstance().colyseusRoom = room;
                    room.onStateChange.once((state) => {
                        navigate("/play", {replace: false});
                        setLoading(false);
                    });
                })
            });
        } catch(error: any) {
            alert("Failed to create game! Maybe we're having server issues ?")
            setLoading(false);
        }
    }
    return (
        <Form noValidate onSubmit={(e) => createGame(e)}>
            <Form.Group className="mb-3" controlId="world">
                <Form.Label>World</Form.Label>
                <Form.Select aria-label="World" disabled={isLoading}>
                    <WorldsOptions/>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="gameMode">
                <Form.Label>Game Mode</Form.Label>
                <Form.Select aria-label="World" disabled={isLoading}>
                    <option value="Classic">Classic</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="private-game">
                <Form.Label>Options</Form.Label>        
                <Form.Check type="checkbox" label="Private game" disabled={isLoading}/>
            </Form.Group>       
            <Button variant="primary" type="submit" disabled={isLoading}>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" hidden={!isLoading}/>
                {isLoading ? ' Creating game...' : 'Create game'}
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
    let navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);

    function joinRandomGame(event: FormEvent<HTMLElement>) {
        event.preventDefault();
        setLoading(true)
        Client.getInstance().colyseusClient.getAvailableRooms().then(rooms => {
            if(rooms.length === 0) {
                setLoading(false)
                alert("Cannot find an empty game, please create your own!")
            } else {
                Client.getInstance().colyseusClient.joinById<World>(rooms[0].roomId).then(room => {
                    Client.getInstance().colyseusRoom = room;
                    room.onStateChange.once((state) => {
                        console.log(state.id)
                        Client.getInstance().apiInterface.world(state.id).then(world =>{
                            Client.getInstance().chiselWorld = world;
                            navigate("/play", {replace: false});
                            setLoading(false)
                        });
                    });
                })
            }
        })
    }
    return (
        <Form noValidate onSubmit={(e) => joinRandomGame(e)}>
            <Button variant="primary" type="submit" disabled={isLoading}>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" hidden={!isLoading}/>
                {isLoading ? ' Joining random game...' : 'Join random game'}
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