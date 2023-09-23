import React, { ReactNode, useState, useRef } from "react";
import styles from "./styles.module.css";
import useOnClickOutside from "helpers/hooks/useOnClickOutside";

interface Props {
  options?: React.ReactNode;
  disabled?: boolean;
}

const RockySelect: React.FC<Props> = (options, disabled) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const showDropdownHandler = () => setShowDropdown(!showDropdown);

  const clickOutsideHandler = () => setShowDropdown(false);

  // custom hook to detect the click on the outside
  //useOnClickOutside(selectContainerRef, clickOutsideHandler);

  const updateSelectedOption = (option: string) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  return (
    <div className="selectContainer">
      <div
        className={showDropdown ? "selected-text active" : "selected-text"}
        onClick={showDropdownHandler}
      >
        {selectedOption.length > 0 ? selectedOption : ""}
      </div>
      <ul
        className={
          showDropdown
            ? "select-options show-dropdown-options"
            : "select-options hide-dropdown-options"
        }
      >
        {options}
      </ul>
    </div>
  );
};

export default RockySelect;
