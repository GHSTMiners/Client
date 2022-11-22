import styles from "./styles.module.css";
import Chart from 'chart.js/auto';
import { registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import { useGlobalStore } from "store";
import { TimeSeries } from "types";
import chroma from "chroma-js"

Chart.register(...registerables);
Chart.defaults.font.size=14;
Chart.defaults.color='rgba(255, 255, 255, 0.7)';

type GraphEntry = { label: string, data: number[], fill: boolean, borderColor: string, tension: number };

export const DepthGraph = () => {
  const isDatabaseLoaded = useGlobalStore( state => state.isDatabaseLoaded );
  const gotchiNames = useGlobalStore( state => state.gotchiNames);
  const isDatabaseAvailable = useGlobalStore( state => state.isDatabaseAvailable);
  const [ depthData, setDepthData ] = useState<TimeSeries[]>([])
  const [ displayData, setDisplayData ] = useState<GraphEntry[]>([])

  useEffect(()=>{
    if (isDatabaseLoaded && gotchiNames){
      setDisplayData(state => {state = []; return([...state])})
      const players = Client.getInstance().databaseFacade.getPlayers();
      const playerColors = chroma.scale(['#fafa6e','#2A4858']).mode('lch').colors(5);
      Object.keys(players).forEach( (playerID,i) => {
        let playerDepth: TimeSeries = Client.getInstance().databaseFacade.getPlayerDepth(+playerID);
        setDepthData( state => { state.push(playerDepth) ; return[...state] });
        setDisplayData( state => {
          state.push({ 
            label: gotchiNames[players[playerID]],
            data: playerDepth.values,
            fill: false,
            borderColor: playerColors[i],
            tension: 0.2
          })
          return [...state]
      })
      })
    } 
  },[isDatabaseLoaded,gotchiNames])

  const data = {
    labels: formatTimestamps(depthData[0]?.timestamps),
    datasets: displayData
  };

  const plotOptions =  {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        reverse: true
      }
    },
    plugins: {
      legend: {
        position: "right" as const,
      },
    }
  };

  function formatTimestamps(timestamps:number[]):string[]{
    let formattedData : string[] = []; 
    timestamps?.forEach( s => formattedData.push((s-(s%=60))/60+(9<s?':':':0')+Math.round(s)) )
    return formattedData
  }
  
  return (
      <div className={styles.graphContainer}>
        { isDatabaseAvailable? 
            <Line data={data} options={plotOptions}/>
            :<div className={styles.graphUnavailable}>
              This data is not yet available. Next time try not to leave your frens behind before the game finishes!
            </div>
        }
      </div>
  );
};
  