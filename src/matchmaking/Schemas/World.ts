// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.31
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Block } from './Block'
import { Player } from './Player'

export class World extends Schema {
    @type("number") public id!: number;
    @type("number") public width!: number;
    @type("number") public height!: number;
    @type("number") public gravity!: number;
    @type ("boolean") public ready!: boolean;
    @type([ Block ]) public blocks: ArraySchema<Block> = new ArraySchema<Block>();
    @type([ Player ]) public players: ArraySchema<Player> = new ArraySchema<Player>();
}
