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
import { useEffect, useState } from "react";
import { number } from "mathjs";
import { setDatasets } from "react-chartjs-2/dist/utils";

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

  type gameTraitObj = { label: string; trait : number};
  type displayDataObj = { name: string; label : string};

  const graphDataInfo: displayDataObj[] = []; 
  const barDataInfo: displayDataObj[] = []; 
  const graphRecord: Record<string, gameTraitObj>= {};
  // Graph game traits
  graphDataInfo.push({name:'Cargo', label:'Cargo'});
  graphDataInfo.push({name:'Health', label:'Health'});
  graphDataInfo.push({name:'Fuel', label:'Fuel'});
  graphDataInfo.push({name:'Flying speed', label:'Movement'});
  graphDataInfo.push({name:'Digging speed', label:'Drill'});
  // Bars game traits
  barDataInfo.push({name:'Consumable price', label:'Shop prices'});
  barDataInfo.push({name:'Refinary yield', label:'Refinery'});
  barDataInfo.push({name:'Upgrade price', label:'Upgrades'});

  const gotchiGameTraitsVec = [gotchiGameTraits[0],gotchiGameTraits[1],gotchiGameTraits[2],gotchiGameTraits[3],gotchiGameTraits[4]];
  const [graphData,setGraphData ]=useState(gotchiGameTraitsVec);

  let data = {
    labels: ["Cargo", "Health", "Fuel", "Speed", "Dril"], //"Cargo", "Health", "Fuel", "Movement speed", "Drilling speed"
    datasets: [
      {
        label: "",
        data: graphData,
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
        world.vitals.forEach((vital)=>{
          try{
            const rawVital = mathjs.evaluate(vital.initial, scope);
            const minVital = mathjs.evaluate(vital.minimum, scope);
            const maxVital = mathjs.evaluate(vital.maximum, scope);
            const normalizedGameTrait = Math.round((rawVital-minVital)/(maxVital-minVital)*100);
            const gameTraitElement =  {label:vital.name, trait:normalizedGameTrait} ;
            gameTraitData.push(gameTraitElement);
            graphRecord[vital.name] = gameTraitElement;
          } catch{}
        })
        world.skills.forEach((skill)=>{
          try{
            const rawSkill = mathjs.evaluate(skill.initial, scope);
            const minSkill = mathjs.evaluate(skill.minimum, scope);
            const maxSkill = mathjs.evaluate(skill.maximum, scope);
            const normalizedGameTrait = Math.round((rawSkill-minSkill)/(maxSkill-minSkill)*100);
            const gameTraitElement =  {label:skill.name, trait:normalizedGameTrait} ;
            gameTraitData.push( gameTraitElement );
            graphRecord[skill.name] = gameTraitElement;
          } catch{}
        })
        setCustomLabels();
        overwriteGraphData()
      })
    } 
  },[selectedGotchi])

  const setCustomLabels = ()=>{
    graphDataInfo.forEach(  dataEntry =>{
        const uiTrait = graphRecord[dataEntry.name];
        if (uiTrait){
            graphRecord[dataEntry.name] = {label:dataEntry.label,trait:uiTrait.trait};
        }
      }
    )
    barDataInfo.forEach(  dataEntry =>{
        const uiTrait = graphRecord[dataEntry.name];
        if (uiTrait){
            graphRecord[dataEntry.name] = {label:dataEntry.label,trait:uiTrait.trait};
        }
      }
    )
  }

  const overwriteGraphData = ()=>{
    let newData = [...graphData];
    graphDataInfo.forEach( (obj,index) =>{
      //newData.labels[index] = graphDataInfo[index].label;
      newData[index] = graphRecord[graphDataInfo[index].name].trait;
    })
    setGraphData(newData);
  }

  const polarChart =(dataset:any)=>{
    return(
      <PolarArea options={displayOptions} data={dataset} />
    )
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
