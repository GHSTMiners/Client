// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 

import { Schema, type} from '@colyseus/schema';


export class Crypto extends Schema {
    @type("string") public name!: string;
    @type("string") public address!: string;
    @type("number") public weight!: number;
    @type("string") public shortcode!: string;
}
