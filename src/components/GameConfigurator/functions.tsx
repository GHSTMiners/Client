import * as Colyseus from "colyseus.js"
import { FormEvent } from "react";
import { useNavigate } from 'react-router-dom';

let client : Colyseus.Client = new Colyseus.Client('ws://localhost:2567');

export function createGame(event: FormEvent<HTMLElement>) {
    event.preventDefault();
    // @ts-ignore: Unreachable code error
    client.create(`${event.target.world.value}_${event.target.gameMode.value}`).then(room => {
        alert(`Succesfull joined the game with id: ${room.id}`)
    });
}

export function joinRandomGame() {
    console.log("Attempting to join random game...")
    client.getAvailableRooms().then(rooms => {
        if(rooms.length === 0) {
            alert("Cannot find an empty game, please create your own!")
        } else rooms.join();
    })
}