import styles from "./styles.module.css";
import Chart from 'chart.js/auto';
import { registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import { useGlobalStore } from "store";
import { TimeSeries } from "types";

Chart.register(...registerables);
Chart.defaults.font.size=14;
Chart.defaults.color='rgba(255, 255, 255, 0.7)';

type GraphEntry = { label: string, data: number[], fill: boolean, borderColor: string, tension: number };

export const DepthGraph = () => {
  const isDatabaseLoaded = useGlobalStore( state => state.isDatabaseLoaded );
  const [ depthData, setDepthData ] = useState<TimeSeries[]>([])
  const [ displayData, setDisplayData ] = useState<GraphEntry[]>([])

  useEffect(()=>{
    if (isDatabaseLoaded){
      // Making sure that the display data array is empty 
      setDisplayData(state => {state = []; return([...state])})
      // TO DO: get a player list (+ missing info) and loop through the code below
      let playerDepth: TimeSeries = Client.getInstance().databaseFacade.getPlayerDepth(1);
      setDepthData( state => { state.push(playerDepth) ; return[...state] });
      setDisplayData( state => {
        state.push({ 
          label: "Gotchinomics",
          data: playerDepth.values,
          fill: false,
          borderColor: "rgba(216, 181, 97, 0.7)",
          tension: 0.2})
          return [...state]
      })
    } 
  },[isDatabaseLoaded])

  const data = {
    labels: depthData[0]?.timestamps,
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
  
  return (
      <div className={styles.graphContainer}>
        <Line data={data} options={plotOptions}/>
      </div>
  );
};
  