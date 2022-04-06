// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { Player } from './Player'
import { Layer } from './Layer'
import { Explosive } from './Explosive';
import { ExchangeEntry } from './ExchangeEntry';

export class World extends Schema {
    @type("number") public id!: number;
    @type("number") public width!: number;
    @type("number") public height!: number;
    @type("number") public gravity!: number;
    @type("boolean") public ready!: boolean;
    @type ({map : ExchangeEntry}) public exchange = new MapSchema<ExchangeEntry>()
    @type([ Explosive ]) public explosives: ArraySchema<Explosive> = new ArraySchema<Explosive>();
    @type([ Player ]) public players: ArraySchema<Player> = new ArraySchema<Player>();    
    @type([ Layer ]) public layers: ArraySchema<Layer> = new ArraySchema<Layer>();
}
