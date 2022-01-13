// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';


export class Skill extends Schema {
    @type("string") public name!: string;
    @type("number") public maximum!: number;
    @type("number") public minimum!: number;
    @type("number") public currentValue!: number;
}
