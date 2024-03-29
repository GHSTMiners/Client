import { ethers } from 'ethers';
import gameEvents from 'game/helpers/gameEvents';
import { Player } from 'matchmaking/Schemas/Player';
import * as Chisel from "chisel-api-interface";
import { ItemTypes } from 'helpers/vars';
import { SkillEffect, VitalEffect } from 'chisel-api-interface';

export interface Tuple<T extends unknown, L extends number> extends Array<T> {
  0: T;
  length: L;
}

export interface AavegotchiGameObject extends AavegotchiObject {
  spritesheetKey: string;
  svg: Tuple<string, 4>;
}

export interface AavegotchiObject extends AavegotchiContractObject {
  svg?: Tuple<string, 4>;
}

export interface AavegotchiContractObject {
  // Only in subgraph
  withSetsNumericTraits: Tuple<number, 6>;
  id: string;
  withSetsRarityScore: number;
  owner: {
    id: string;
  };

  // collateral: string;
  name: string;
  // modifiedNumericTraits: number[];
  // numericTraits: number[];
  // owner: string;
  // randomNumber: string;
  status: number;
  // tokenId: ethers.BigNumber;
  // items: ItemsAndBalances[];
  equippedWearables: Tuple<number, 16>;
  // experience: ethers.BigNumber;
  // hauntId: ethers.BigNumber;
  // kinship: ethers.BigNumber;
  // lastInteracted: string;
  // level: ethers.BigNumber;
  // toNextLevel: ethers.BigNumber;
  // stakedAmount: ethers.BigNumber;
  // minimumStake: ethers.BigNumber;
  // usedSkillPoints: ethers.BigNumber;
  // escrow: string;
  // baseRarityScore: ethers.BigNumber;
  // modifiedRarityScore: ethers.BigNumber;
  // locked: boolean;
  // unlockTime: string;
}

export interface ItemsAndBalances {
  itemType: ItemObject;
  itemId: ethers.BigNumber;
  balance: ethers.BigNumber;
}

export interface ItemObject {
  allowedCollaterals: number[];
  canBeTransferred: boolean;
  canPurchaseWithGhst: boolean;
  description?: string;
  category: number;
  experienceBonus: string;
  ghstPrice: ethers.BigNumber;
  kinshipBonus: string;
  maxQuantity: ethers.BigNumberish;
  minLevel: string;
  name: string;
  rarityScoreModifier: string;
  setId: string;
  slotPositions: boolean[];
  svgId: number;
  totalQuantity: number;
  traitModifiers: number[];
}

export interface SubmitScoreReq {
  name: string,
  tokenId: string,
}

export interface HighScore {
  tokenId: string,
  score: number,
  wallet?: string,
  name: string,
}

export interface CustomError extends Error {
  status?: number;
}

export type TabsType = {
  label: string;
  index: number;
  Component: React.FC<{}>;
}[];

export type IndexedArray = {[key: string]: number};

export type IndexedString = {[key: string]: string};

export type IndexedBooleanArray = {[key: string]: boolean};

export type IndexedItem = {[key: string]: Item};

export type GameEventKey = keyof typeof gameEvents;

export type PricePair = { cryptoId:number, cost:number };

export type CryptoEntry = {id: number, quantity: number};

export type Crypto = { cryptoID: number; name: string; image: string ; price:number; crystal: string};

export type IndexedCrypto =  {[key: string]: Crypto} ;

export type CustomEvents = { [key:string]: symbol }

export type GameEventList = { [key:string]: CustomEvents }

export type IndexedPlayers =  {[key: string]: Player} ;

export type Item = { 
  id:number, 
  name: string, 
  image:string, 
  type: ItemTypes, 
  quantity: number, 
  price: number, 
  crypto_id: number,
  cooldown:number,
  carry_limit?:number,
  purchase_limit?:number,
  callback: () => void, 
}

export type ExplosiveItem = Item & { pattern: Chisel.ExplosionCoordinate[] }

export type ConsumableItem = Item & { description: string, duration: number, skill_effects:SkillEffect[], vital_effects:VitalEffect[],}

export type IndexedExplosives =  {[key: string]: ExplosiveItem} ;

export type ConsumableSchema = { amount:number, nextTimeAvailable:number, amountSpawned:number, amountPurchased:number };

export type ConsumableRecord = Record< number, ConsumableSchema>;

export type InventoryExplosives = Record< number, ExplosiveItem>;

export type InventoryConsumables = Record< number, ConsumableItem>;

export type PlayerBalance = {playerId: number, total: number };

export type IndexedBalance = {[key: string]: PlayerBalance};

export type PlayerVitals = { fuel:number, health:number, cargo:number};

export type TierCost = { tierLabel:string, priceList:PricePair[] };

export type UpgradePrice = { id:number, name:string, costPerTier:TierCost[], description:string };

export type RoomGotchi =  { gotchiId: number, name: string, svgURL: string } ;

export type IndexedRoomGotchis = { [key: string]: RoomGotchi}

export type endedGameMessage = { roomId: string, gotchiId: string };

export type TimeSeries = { timestamps:number[]; values:number[] }

export type ScatteredData = {x:number, y:number} ; 

export type GraphEntry = { label?: string, data: ScatteredData[], fill?: boolean, borderColor?: string, tension?: number , radius?: number, pointStyle?:any, pointRadius?:number};

export type GraphData = { datasets: GraphEntry[]}

export type SelectionPair = { value: string, label:any}