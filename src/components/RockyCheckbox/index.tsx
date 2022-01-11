import styles from "./styles.module.css";
import { useState } from "react";
import StoneCheckboxTick from "assets/icons/dropdown_arrow.svg";

interface Props {
  textLabel?: string;
}

export function RockyCheckbox({ textLabel }: Props) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <label className={styles.container}>
      <input
        type={"checkbox"}
        onChange={() => {
          setIsChecked(!isChecked);
          console.log(isChecked);
        }}
      ></input>
      <span className={styles.checkbox}>
        {isChecked ? (
          <img
            src={StoneCheckboxTick}
            className={styles.checkboxTick}
            alt={"Rocky checkbox Tick"}
          />
        ) : (
          ""
        )}
      </span>
      {textLabel}
    </label>
  );
}

// conditional format:
//<span className={`${styles.checkbox} ${isChecked ? styles.active : ""}`}></span>
