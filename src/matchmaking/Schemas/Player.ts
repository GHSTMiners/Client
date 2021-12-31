// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.31
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class Player extends Schema {
    @type("string") public name!: string;
    @type("string") public playerSessionID!: string;
    @type("number") public x!: number;
    @type("number") public y!: number;
    @type("number") public gotchiID!: number;
}
