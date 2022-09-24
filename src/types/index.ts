import { ethers } from 'ethers';
import gameEvents from 'game/helpers/gameEvents';
import { Player } from 'matchmaking/Schemas/Player';
import * as Chisel from "chisel-api-interface";

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

export type PlayerContext = { world : { crypto: IndexedCrypto, explosives: IndexedExplosives},
                              player: { crypto: IndexedArray,
                                        total: number, 
                                        explosives: IndexedArray, 
                                        depth: number, 
                                        vitals:PlayerVitals,
                                        crystals: IndexedArray } 
                            };

export type IndexedArray = {[key: string]: number};

export type IndexedString = {[key: string]: string};

export type IndexedBooleanArray = {[key: string]: boolean};

export type GameEventKey = keyof typeof gameEvents;

export type PricePair = { cryptoId:number, cost:number };

export type CryptoEntry = {id: number, quantity: number};

export type Crypto = { cryptoID: number; name: string; image: string ; price:number; crystal: string};

export type IndexedCrypto =  {[key: string]: Crypto} ;

export type ConsumableItem = { id:number, name: string, image:string, type: string, quantity: number}

export type CustomEvents = { [key:string]: symbol }

export type GameEventList = { [key:string]: CustomEvents }

export type IndexedPlayers =  {[key: string]: Player} ;

export type ExplosiveItem = { id:number, name: string, image:string, pattern: Chisel.ExplosionCoordinate[], type: string, quantity: number, price: number }

export type IndexedExplosives =  {[key: string]: ExplosiveItem} ;

export type InventoryExplosives = Record< number, ExplosiveItem>;

export type PlayerBalance = {playerId: number, total: number };

export type PlayerVitals = { fuel:number, health:number, cargo:number};

export type TierCost = { tierLabel:string, priceList:PricePair[] };

export type UpgradePrice = { id:number, name:string, costPerTier:TierCost[], description:string };

export type ShopItem = { name: string; id: number; price: number; pattern: Chisel.ExplosionCoordinate[]; image: string };
