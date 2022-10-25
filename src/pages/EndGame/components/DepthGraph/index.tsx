import styles from "./styles.module.css";
import Chart from 'chart.js/auto';
import { registerables } from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(...registerables);
Chart.defaults.font.size=14;
Chart.defaults.color='rgba(255, 255, 255, 0.7)';

export const DepthGraph = () => {

  // TO DO : fetch from Chisel when available
  const data = {
    labels: ["0min","5min","10min","15min","20min","25min","30min"],
    datasets: [
      {
        label: "Voyager",
        data: [0, 20, 10, 120, 250, 180, 320],
        fill: false,
        borderColor: "rgba(216, 181, 97, 0.7)",
        tension: 0.2
      },
      {
        label: "Yoda",
        data: [0, 30, 90, 100, 200, 0, 380],
        borderColor:  "rgba(143, 164, 148, 0.7)",
        tension: 0.2
      },
      {
        label: "Machete",
        data: [0, 50, 150, 0, 270, 0, 400],
        borderColor: "rgba(69, 146, 198, 0.7)",
        tension: 0.2
      },
      {
        label: "Corleone",
        data: [0, 10, 60, 120, 0, 222, 333],
        borderColor: "rgba(75,192,192,0.7)",
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
  