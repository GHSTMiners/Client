import { KeyboardLayouts } from "helpers/vars";
import { useState } from "react";
import Switch from "react-switch"
import { useGlobalStore } from "store";
import styles from "./styles.module.css"

const KeyboardLayoutToggle: React.FC  = () => {
    const keyboardLayout = useGlobalStore.getState().keyboardLayout;
    const setKeyboardLayout = useGlobalStore.getState().setKeyboardLayout;
    const [checked,setChecked] = useState(keyboardLayout===KeyboardLayouts.QWERTY) ;

    const handleChange = (nextChecked:boolean) => {
        nextChecked? setKeyboardLayout(KeyboardLayouts.QWERTY):setKeyboardLayout(KeyboardLayouts.AZERTY)
        setChecked(nextChecked)
    };

    return (
    <>
        <Switch
          width={100}
          onChange={handleChange}
          checked={checked}
          offColor="#86d3ff"
          offHandleColor="#2693e6"
          uncheckedIcon={ <div className={styles.toggleDisabled}>AZERTY</div>}
          checkedIcon={ <div className={styles.toggleEnabled}>QWERTY</div>}
        />
    </>
    )
}

export default KeyboardLayoutToggle
