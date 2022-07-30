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
import { displayOptions } from "./displayOptions";
import Client from "matchmaking/Client";
import * as mathjs from "mathjs"
import React, { useEffect, useState } from "react";

interface Props {
  selectedGotchi?: AavegotchiObject;
  worldID?:number;
}

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export const TraitsPanel = ({ selectedGotchi, worldID=6 }: Props) => {

  type gameTraitObj = { label: string; trait : number};
  type displayDataObj = { name: string; label : string};
  
  // Graph game traits
  const defaultGraphTraits: Array<number> = [];
  const graphLabels: Array<string> = [];
  const graphDataInfo: displayDataObj[] = []; 
  graphDataInfo.push({name:'Cargo', label:'Cargo'});
  graphDataInfo.push({name:'Health', label:'Health'});
  graphDataInfo.push({name:'Fuel', label:'Fuel'});
  graphDataInfo.push({name:'Flying speed', label:'Movement'});
  graphDataInfo.push({name:'Digging speed', label:'Drill'});
  graphDataInfo.forEach(entry =>{
    defaultGraphTraits.push(50);
    graphLabels.push(entry.label);
  })
  const [graphTraits,setGraphTraits ]=useState(defaultGraphTraits);
  
  // Bar game traits
  const defaultBarTraits: Array<number> = [];
  const barDataInfo: displayDataObj[] = []; 
  barDataInfo.push({name:'Consumable price', label:'Shop prices'});
  barDataInfo.push({name:'Refinery yield', label:'Refinery'});
  barDataInfo.push({name:'Moving speed', label:'Upgrades'}); // TO DO: UPDATE WHEN THIS TRAIT IS AVAILABLE IN CHISEL
  barDataInfo.forEach( entry =>{
    defaultBarTraits.push(50);
  })
  const [barTraits,setBarTraits ]=useState(defaultBarTraits);

  let data = {
    labels: graphLabels, 
    datasets: [
      {
        label: "",
        data: graphTraits,
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

  const dataRecord: Record<string, gameTraitObj>= {};

  useEffect(() => {
    let mounted = true; // safety component to avoid leackage if async info arrives when the component is unmounted
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
      try{
        
        const selectedWorld = Client.getInstance().apiInterface.world(worldID);
          if (mounted){
          selectedWorld.then( world => { 
            world.vitals.forEach((vital)=>{
              try{
                const rawVital = mathjs.evaluate(vital.initial, scope);
                const minVital = mathjs.evaluate(vital.minimum, scope);
                const maxVital = mathjs.evaluate(vital.maximum, scope);
                const normalizedGameTrait = Math.round((rawVital-minVital)/(maxVital-minVital)*100);
                const gameTraitElement =  {label:vital.name, trait:normalizedGameTrait} ;
                gameTraitData.push(gameTraitElement);
                dataRecord[vital.name] = gameTraitElement;
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
                dataRecord[skill.name] = gameTraitElement;
              } catch{}
            })
            setCustomLabels();
            // Updating front-end data after receiving all info from Chisel
            if (mounted){
              updateStateData(graphTraits,graphDataInfo,setGraphTraits);
              updateStateData(barTraits,barDataInfo,setBarTraits);
            }
          })
        }
      } catch (err) {
        console.log(err);
      }
    } 
    return () => {mounted = false}; // cleanup function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedGotchi,worldID])

  const setCustomLabels = ()=>{
    graphDataInfo.forEach(  dataEntry =>{
        const uiTrait = dataRecord[dataEntry.name];
        if (uiTrait){
          dataRecord[dataEntry.name] = {label:dataEntry.label,trait:uiTrait.trait};
        }
      }
    )
    barDataInfo.forEach(  dataEntry =>{
        const uiTrait = dataRecord[dataEntry.name];
        if (uiTrait){
          dataRecord[dataEntry.name] = {label:dataEntry.label,trait:uiTrait.trait};
        }
      }
    )
  }

  const updateStateData = (traits:number[],displayObjs:displayDataObj[],setMethod:(value:React.SetStateAction<number[]>)=>void) =>{
    let newTraits = [...traits];
    displayObjs.forEach( (obj,index) =>{
      newTraits[index] = dataRecord[displayObjs[index].name].trait;
    })
    setMethod(newTraits);
  }

  const renderModifierBar = (
    name: string,
    percentage: string,
    label: string
  ) => (
    <div className={styles.modifierRow} key={name}>
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

  let renderedTraitBars = barDataInfo.map(function (traitObj,index) {
    return (renderModifierBar(traitObj.label, `${barTraits[index]}%`, ""))
  });

  return (
    <div className={styles.graphContainer}>
      <div className={styles.gotchiName}>
        {selectedGotchi ? `${selectedGotchi?.name}` : "..."}
      </div>
      <div className={styles.polarChart}>
        <PolarArea options={displayOptions} data={data} />
      </div>
      <div className={styles.barsContainer}>
        {renderedTraitBars} 
      </div>
    </div>
  );
};