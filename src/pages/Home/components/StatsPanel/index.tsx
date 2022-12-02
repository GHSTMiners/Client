import styles from "./styles.module.css";
import Chart from 'chart.js/auto';
import { registerables } from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(...registerables);
Chart.defaults.font.size=14;
Chart.defaults.color='rgba(255, 255, 255, 0.7)';

export const StatsPanel = () => {

  // TO DO : fetch from Chisel when available
  const data = {
    labels: ["January","February","March","April","May","June","July"],
    datasets: [
      {
        label: "Europe",
        data: [956, 512, 3622, 2366, 5126, 4232, 6215],
        fill: false,
        borderColor: "rgba(216, 181, 97, 0.7)",
        tension: 0.3
      },
      {
        label: "America",
        data: [256, 512, 1024, 4096, 8192, 7000, 7500],
        borderColor:  "rgba(143, 164, 148, 0.7)",
        tension: 0.3
      },
      {
        label: "Asia",
        data: [755, 1512, 4024, 6096, 3192, 5000, 6500],
        borderColor: "rgba(69, 146, 198, 0.7)",
        tension: 0.3
      }
    ]
  };

  const plotOptions =  {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    }
  };
  
  return (
      <div className={styles.graphContainer}>
        <div className={styles.infoTitle}> Blocks Mined by Region </div>
        <Line data={data} options={plotOptions}/>
      </div>
  );
};
  