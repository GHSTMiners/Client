// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class PlayerState extends Schema {
    @type("int32") public x!: number;
    @type("int32") public y!: number;
    @type("int32") public velocityX!: number;
    @type("int32") public velocityY!: number;
    @type("number") public movementState!: MovementState;
    @type ("number") movementDirection : MovementDirection = MovementDirection.Down
}

export enum MovementState {
    Stationary = 0,
    Moving = 1,
    Flying = 2,
    Drilling = 3
}

export enum MovementDirection {
    Down = 1,
    Left = 2,
    Right = 3,
    None = 4
}