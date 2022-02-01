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

interface Props {
  selectedGotchi?: AavegotchiObject;
}

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

export const TraitsPanel = ({ selectedGotchi }: Props) => {
  const gotchiGameTraits = GameTraits({
    gotchi: selectedGotchi,
    gameWorld: "Classic",
  });

  const data = {
    labels: ["Cargo", "Health", "Fuel", "Speed", "Dril"], //"Cargo", "Health", "Fuel", "Movement speed", "Drilling speed"
    datasets: [
      {
        label: "",
        data: [
          gotchiGameTraits[0],
          gotchiGameTraits[1],
          gotchiGameTraits[2],
          gotchiGameTraits[3],
          gotchiGameTraits[4],
        ],
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
