import styles from "./styles.module.css";
import Chart from 'chart.js/auto';
import { registerables } from "chart.js";
import { Scatter } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import { useGlobalStore } from "store";
import { GraphData, GraphEntry } from "types";
import chroma from "chroma-js"
import { DatabaseTables } from "helpers/vars";
import { linePlotOptions } from "./displayOptions"

Chart.register(...registerables);
Chart.defaults.font.size=14;
Chart.defaults.color='rgba(255, 255, 255, 0.7)';

export const DepthGraph = () => {
  const isDatabaseLoaded = useGlobalStore( state => state.isDatabaseLoaded );
  const gotchiNames = useGlobalStore( state => state.gotchiNames);
  const isDatabaseAvailable = useGlobalStore( state => state.isDatabaseAvailable);
  const [ lineData , setLineData ] = useState<GraphData>({} as GraphData)

  useEffect(()=>{
    if (isDatabaseLoaded && gotchiNames ){
      const datasets: GraphEntry[] = [];
      const players = Client.getInstance().databaseFacade.getPlayers();
      const playerColors = chroma.scale(['#fafa6e','#2A4858']).mode('lch').colors(5);
      
      Object.keys(players).forEach( (playerID,i) => {
        const playerDepth = Client.getInstance().databaseFacade.getScatteredData( +playerID, DatabaseTables.Depth );
        const historicalData = { 
          label: gotchiNames[players[playerID]],
          data: playerDepth,
          fill: true,
          showLine: true,
          borderColor: playerColors[i],
          tension: 0.2
        };
        datasets.push(historicalData);
      })
      setLineData( { datasets: datasets }  )
      console.count('Rendering graph data...') 
    } 
  },[isDatabaseLoaded,gotchiNames])
  
  return (
      <div className={styles.graphContainer}>
        { isDatabaseAvailable? 
             ( lineData.datasets? 
              <>
                <Scatter data={lineData} options={linePlotOptions} />  
              </>
                : null )
            :<div className={styles.graphUnavailable}>
              This data is not yet available. Next time try not to leave your frens behind before the game finishes!
            </div>
        }
      </div>
  );
};
  
// <Line data={lineData} options={plotOptions}/>