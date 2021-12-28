import React from "react";
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

interface Props {
  selectedGotchi?: AavegotchiObject;
}

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export const TraitsPanel = ({ selectedGotchi }: Props) => {
  const data = {
    labels: ["Cargo", "Health", "Fuel", "Speed", "Dril"], //"Cargo", "Health", "Fuel", "Movement", "Drilling", "Movement"
    datasets: [
      {
        label: "",
        data: [90, 84, 12, 26, 50],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "left" as const,
        labels: {
          color: "#cecece",
          boxWidth: 10,
          padding: 10,
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      r: {
        display: true,
        ticks: {
          display: false,
          showLabelBackdrop: false,
        },
      },
    },
  };

  const renderModifier = (name: string, percentage: string, label: string) => (
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
      <div className={styles.nameTitle}>
        {selectedGotchi ? `${selectedGotchi?.name}` : "..."}
      </div>
      <PolarArea options={options} data={data} />
      {renderModifier("Explosives", "25%", "")}
      {renderModifier("Crystals", "75%", "")}
      {renderModifier("Upgrades", "10%", "")}
    </div>
  );
};

//<span className={styles.pricesTitle}>Price Modifiers</span>
