import { AavegotchiObject } from "types";

interface Props {
  gotchi?: AavegotchiObject | any;
  gameWorld?: String;
}

export const GameTraits = ({ gotchi, gameWorld }: Props) => {
  // Main OUTPUT
  const traits = new Array(8); // [ cargo, health, fuel, speed, drill, explosives, crystals, upgrades]
  // Internal Settings required to compute game traits
  const absMin = -50;
  const absMax = 150;
  const modifierMax = 100;
  const modifierMin = 10;
  // Internal variables pre-calculated from internal settings
  const absRange = absMax - absMin;
  const modifierRange = modifierMax - modifierMin;
  const modifierCentroid = (modifierMax - modifierMin) / 2 + modifierMin;

  const computeGameTrait = (
    gotchiTrait: number,
    traitMultiplier: number // either +1 for the bigger the better, or -1 for the smaller the gotchi trait, the higher the game trait
  ): number => {
    const H1 = (traitMultiplier + 1) / 2;
    const H2 = (-traitMultiplier + 1) / 2;
    const gameTrait =
      ((traitMultiplier * gotchiTrait - absMin) / absRange) * modifierRange +
      H1 * modifierMin +
      H2 * modifierCentroid;
    return gameTrait;
  };

  // The if gotchi is available (RPC connected), each game modifier is calculated from each gotchi trait
  // This is now hard-coded but it should be parsed from the server's world settings (PENDING IMPROVEMENT)
  if (gotchi) {
    // Cargo ||  AGG -
    traits[0] = computeGameTrait(gotchi.withSetsNumericTraits[1], -1);
    // Health ||  SPK +
    traits[1] = computeGameTrait(gotchi.withSetsNumericTraits[2], +1);
    // Fuel || NRG -
    traits[2] = computeGameTrait(gotchi.withSetsNumericTraits[0], -1);
    // Speed (Movement) || NRG +
    traits[3] = computeGameTrait(gotchi.withSetsNumericTraits[0], +1);
    // Drill (speed) || AGG +
    traits[4] = computeGameTrait(gotchi.withSetsNumericTraits[1], +1);
    // Explosives (Discounts) || BRN -
    traits[5] = computeGameTrait(gotchi.withSetsNumericTraits[3], -1);
    // Crystals (Exchange Rate) || BRN +
    traits[6] = computeGameTrait(gotchi.withSetsNumericTraits[3], +1);
    // Upgrades (Discounts) || SPK -
    traits[7] = computeGameTrait(gotchi.withSetsNumericTraits[2], -1);
  }

  return traits;
};
