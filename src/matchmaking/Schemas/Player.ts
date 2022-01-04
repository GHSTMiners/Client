// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.31
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';

export enum PlayerState {
    Stationary = 0,
    Moving = 1,
    Flying = 2,
    Drilling = 3
}

export enum DrillingDirection {
    Down = 1,
    Left = 2,
    Right = 3,
}

export class Player extends Schema {
    @type("string") public name!: string;
    @type("string") public playerSessionID!: string;
    @type("number") public x!: number;
    @type("number") public y!: number;
    @type("number") public gotchiID!: number;
    @type ("number") playerState! : PlayerState;
    @type ("number") drillingDirection! : DrillingDirection;
}
