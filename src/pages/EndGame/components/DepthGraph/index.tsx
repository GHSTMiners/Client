import styles from "./styles.module.css";
import Chart from 'chart.js/auto';
import { registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Client from "matchmaking/Client";
import { useGlobalStore } from "store";

Chart.register(...registerables);
Chart.defaults.font.size=14;
Chart.defaults.color='rgba(255, 255, 255, 0.7)';

export const DepthGraph = () => {
  const isDatabaseLoaded = useGlobalStore( state => state.isDatabaseLoaded );
  const [depthData,setDepthData] = useState<number[]>([])

  useEffect(()=>{
    if (isDatabaseLoaded){
      setDepthData(state => {state = Client.getInstance().databaseFacade.getPlayerDepth(1); return[...state]});
    }
  },[isDatabaseLoaded])
  
  // TO DO : fetch from Chisel when available
  const data = {
    labels: Array.from(Array(depthData.length).keys()).map(x => x + 1),
    datasets: [
      {
        label: "Gotchinomics",
        data: depthData,
        fill: false,
        borderColor: "rgba(216, 181, 97, 0.7)",
        tension: 0.2
      }
    ]
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
  