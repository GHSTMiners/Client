import { useState, useRef } from "react";
import { SearchIcon } from "assets";
import styles from "./styles.module.css";

interface Props {
  onChange: (text: string) => void;
  placeholder: string;
  onToggle: (active: boolean) => void;
  activeOverride?: boolean;
}

export const SearchToggle = ({
  onChange,
  placeholder,
  onToggle,
  activeOverride,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (!open) {
      inputRef?.current?.focus();
    }
    setOpen((prevState) => !prevState);
    onToggle(!open);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setValue(input);
    onChange(input);
  };

  return (
    <div
      className={`${styles.inputContainer} ${
        (activeOverride !== undefined ? activeOverride : open)
          ? styles.open
          : ""
      }`}
    >
      <button className={styles.toggle} onClick={handleToggle}>
        <SearchIcon style={{padding: "0.5rem", width: "2.8rem", height:"2.8rem"}} className={styles.iconContainer}/>
      </button>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        value={value}
        onChange={handleOnChange}
        placeholder={placeholder}
      />
    </div>
  );
};
