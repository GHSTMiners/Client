// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3l
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { PlayerState } from './PlayerState'
import { Vital } from './Vital'
import { Skill } from './Skill'
import { CargoEntry } from './CargoEntry'
import { WalletEntry } from './WalletEntry'
import { ExplosiveEntry } from './ExplosiveEntry';
import { Upgrade } from './Upgrade';

export class Player extends Schema {
    @type("string") public name!: string;
    @type("string") public playerSessionID!: string;
    @type("number") public gotchiID!: number;
    @type("string") public chatColor!: string;
    @type(PlayerState) public playerState: PlayerState = new PlayerState();
    @type([ Upgrade ]) public upgrades: ArraySchema<Upgrade> = new ArraySchema<Upgrade>();
    @type([ Vital ]) public vitals: ArraySchema<Vital> = new ArraySchema<Vital>();
    @type([ Skill ]) public skills: ArraySchema<Skill> = new ArraySchema<Skill>();
    @type({ map: CargoEntry }) public cargo: MapSchema<CargoEntry> = new MapSchema<CargoEntry>();
    @type({ map: WalletEntry }) public wallet: MapSchema<WalletEntry> = new MapSchema<WalletEntry>();
    @type({ map: ExplosiveEntry }) public explosives: MapSchema<ExplosiveEntry> = new MapSchema<ExplosiveEntry>();
}
