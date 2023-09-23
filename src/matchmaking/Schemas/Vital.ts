// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Schema, type } from '@colyseus/schema';


export class Vital extends Schema {
    @type("string") public name!: string;
    @type("number") public maximum!: number;
    @type("number") public minimum!: number;
    @type("number") public emptyValue!: number;
    @type("number") public filledValue!: number;
    @type("number") public currentValue!: number;
}
