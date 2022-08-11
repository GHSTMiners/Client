import { ethers } from 'ethers';
import gameEvents from 'game/helpers/gameEvents';
import { Player } from 'matchmaking/Schemas/Player';

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

export type IndexedArray = {[key: string]: number};

export type IndexedBooleanArray = {[key: string]: boolean};

export type GameEventKey = keyof typeof gameEvents;

export type PricePair = { cryptoId:number, cost:number };

export type CryptoEntry = {id: number, quantity: number};

export type CryptoObj = { cryptoID: number; name: string; image: string ; price:number};

export type IndexedCrypto =  {[key: string]: CryptoObj} ;

export type consumableItem = { name: string, id:number, image:string, type: string, quantity: number}

export type CustomEvents = { [key:string]: symbol }

export type GameEventList = { [key:string]: CustomEvents }

export type IndexedPlayers =  {[key: string]: Player} ;

export type inventoryExplosives = Record< number, consumableItem>;

export type playerObj = {playerId: number, ggems: number };

export type playerContext = { consumables:consumableItem[] , wallet: IndexedArray}

