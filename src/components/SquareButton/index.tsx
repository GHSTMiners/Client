import { ItemTypes } from "helpers/vars";
import React, { useEffect, useRef } from "react";
import { useGlobalStore } from "store";
import styles from "./styles.module.css";

interface Props {
  type: ItemTypes;
  quantity?: number;
  children?: React.ReactNode;
  onClick?: () => void;
  size?: string;
  disabled?: boolean;
}

const SquareButton: React.FC<Props> = ({
  quantity ,
  type,
  children,
  onClick,
  size,
  disabled,
}) => {
  const buttonRef = useRef<any>(null);
  const isDraggingItem = useGlobalStore(state=> state.isDraggingItem)
  
  useEffect(()=>{
    if (!isDraggingItem) buttonRef.current?.blur();
  },[isDraggingItem])
  
  return (
    <button onClick={onClick} className={styles.squareButton} disabled={disabled} ref={buttonRef}>
      <div className={(isDraggingItem && children instanceof Array && type === ItemTypes.Explosive)? styles.isDragging :''}>
        <div className={`${styles.buttonText} ${(quantity === undefined || quantity <1)? styles.disabled: '' }`} style={{ width: size, height: size }}>
          {children}
        </div>
      </div>
    </button>
  );
};

export default SquareButton;
