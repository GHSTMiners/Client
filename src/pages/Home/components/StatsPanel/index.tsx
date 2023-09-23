import styles from "./styles.module.css";
import Chart from 'chart.js/auto';
import { registerables } from "chart.js";
import { Scatter } from "react-chartjs-2";
import { GraphData } from "types";
import { SpinnerCircular } from "spinners-react";

Chart.register(...registerables);
Chart.defaults.font.size=14;
Chart.defaults.color='rgba(255, 255, 255, 0.7)';

interface Props {
  graphData : GraphData
  isDataReady : boolean
}

const plotOptions =  {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      min: new Date().getTime()- (28*24*60*60*1000),
      max:  new Date().getTime(),
      ticks: {
        callback: function(timestamp:any){
          return new Date(timestamp).toLocaleDateString() 
        }
      }
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
          label: function(context:any) {
              return `${context.raw.y} games on ${new Date(context.raw.x).toLocaleDateString()}`; // @ ${context.dataset.label} cluster
          }
      }
  }
  }
};

export const StatsPanel = ( { graphData, isDataReady } : Props ) => {
  return (
      <div className={styles.graphContainer}>
        <div className={styles.infoTitle}> Daily Games </div>
        { isDataReady? 
               ( graphData.datasets? 
                <> 
                  <Scatter data={graphData} options={plotOptions} />
                </>
                  : null )
              : 
              <div className={styles.graphUnavailable}>
                <SpinnerCircular color={'ffffff'}/>
              </div>
          }
      </div>
  );
};
  