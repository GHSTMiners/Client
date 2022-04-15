import { AavegotchiObject } from "types";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import styles from "./styles.module.css";
import { GameTraits } from "components/GameTraits";
import { displayOptions } from "./displayOptions";
import Client from "matchmaking/Client";
import * as Chisel from "chisel-api-interface";
import * as mathjs from "mathjs"
import { useEffect } from "react";

interface Props {
  selectedGotchi?: AavegotchiObject;
  worldID?:number;
}

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export const TraitsPanel = ({ selectedGotchi, worldID=6 }: Props) => {
  const gotchiGameTraits = GameTraits({
    gotchi: selectedGotchi,
    gameWorld: "Classic",
  });

  type gameTraitObj = { name: string; trait : number};
  
  const data = {
    labels: ["Cargo", "Health", "Fuel", "Speed", "Dril"], //"Cargo", "Health", "Fuel", "Movement speed", "Drilling speed"
    datasets: [
      {
        label: "",
        data: [
          gotchiGameTraits[0],
          gotchiGameTraits[1],
          gotchiGameTraits[2],
          gotchiGameTraits[3],
          gotchiGameTraits[4],
        ],
        backgroundColor: [
          "rgba(216, 181, 97, 0.7)",
          "rgba(143, 164, 148, 0.7)",
          "rgba(69, 146, 198, 0.7)",
          "rgba(147, 154, 76, 0.7)",
          "rgba(48, 116, 71, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(()=>{
    if (selectedGotchi){
      const scope = {
        energy: selectedGotchi.withSetsNumericTraits[0],
        aggressiveness: selectedGotchi.withSetsNumericTraits[1],
        spookiness: selectedGotchi.withSetsNumericTraits[2],
        brain_size: selectedGotchi.withSetsNumericTraits[3],
        eye_shape: selectedGotchi.withSetsNumericTraits[4],
        eye_color: selectedGotchi.withSetsNumericTraits[5]
      }
      const gameTraitData: gameTraitObj[] = [];
      const selectedWorld = Client.getInstance().apiInterface.world(worldID);
      selectedWorld.then( world => { 
        const x = world.vitals.forEach((vital)=>{
          try{
            let rawVital = mathjs.evaluate(vital.initial, scope);
            let minVital = mathjs.evaluate(vital.minimum, scope);
            let maxVital = mathjs.evaluate(vital.maximum, scope);
            let normalizedGameTrait = Math.round((rawVital-minVital)/(maxVital-minVital)*100);
            gameTraitData.push( {name:vital.name, trait:normalizedGameTrait} );
          } catch{}
        })
        const y = world.skills.forEach((skill)=>{
          try{
            let rawSkill = mathjs.evaluate(skill.initial, scope);
            let minSkill = mathjs.evaluate(skill.minimum, scope);
            let maxSkill = mathjs.evaluate(skill.maximum, scope);
            let normalizedGameTrait = Math.round((rawSkill-minSkill)/(maxSkill-minSkill)*100);
            gameTraitData.push( {name:skill.name, trait:normalizedGameTrait} );
          } catch{}
        })
        setGraphData(gameTraitData)
      })
    } 
  },[selectedGotchi])

  const setGraphData = (gameTraitData:gameTraitObj[])=>{
    //TO DO: CREATE A MAPPING FUNCTION TO UPDATE THE GRAPHS BY FILTERING THE RAW DATA AND ONLY DISPLAY THE MOST RELEVANT
    console.log(gameTraitData)
  }

  const renderModifierBar = (
    name: string,
    percentage: string,
    label: string
  ) => (
    <div className={styles.modifierRow}>
      <p>{name}</p>
      <div className={styles.modifierMeter}>
        <div className={styles.labelStyles}>
          <span className={styles.progress} style={{ width: percentage }}>
            <span className={styles.labelStyles}>{`${label}`}</span>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.graphContainer}>
      <div className={styles.gotchiName}>
        {selectedGotchi ? `${selectedGotchi?.name}` : "..."}
      </div>
      <div className={styles.polarChart}>
        <PolarArea options={displayOptions} data={data} />
      </div>
      <div className={styles.barsContainer}>
        {renderModifierBar("Explosives", `${gotchiGameTraits[5]}%`, "")}
        {renderModifierBar("Crystals", `${gotchiGameTraits[6]}%`, "")}
        {renderModifierBar("Upgrades", `${gotchiGameTraits[7]}%`, "")}
      </div>
    </div>
  );
};
