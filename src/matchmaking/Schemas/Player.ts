// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.3l
// 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Schema, type, ArraySchema, MapSchema } from '@colyseus/schema';
import { PlayerState } from './PlayerState'
import { Vital } from './Vital'
import { Skill } from './Skill'
import { Upgrade } from './Upgrade';
import { CargoEntry } from './CargoEntry'
import { WalletEntry } from './WalletEntry'
import { ExplosiveEntry } from './ExplosiveEntry';
import { ConsumableEntry } from './ConsumableEntry';

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
    @type({ map: ConsumableEntry }) public consumables: MapSchema<ConsumableEntry> = new MapSchema<ConsumableEntry>();
}
