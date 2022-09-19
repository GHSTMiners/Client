import { useState } from 'react';
import Select from 'react-select';
import styles from './styles.module.css';

type SelectionPair = { value: string, label:any}




const RegionSelection = () => {

    const defaultLabel = <><img src={`https://icons.iconarchive.com/icons/wikipedia/flags/96/EU-European-Union-Flag-icon.png`} style={{height: '2rem', padding: '0 0.5rem 0 0'}}/> Western Europe</>;
    const [selectedOption, setSelectedOption ]= useState<SelectionPair>({ value: 'Europe', label: defaultLabel})
    // dummy options, TO DO : fetch from chisel
    const clusterOptions = [
        { value: 'Europe', label:  defaultLabel },
        { value: '🇨🇳 Asia', label: 'Asia' },
        { value: 'America', label: 'America' },
      ];

    const customStyles = {
      singleValue:(provided:any) => ({
        ...provided,
        color:'rgba(255,255,255,1)',
        'textAlign': 'center',
        'paddingLeft': '0rem',
      })
    }

    return(
        <>
            <Select
            value={selectedOption}
            className={styles.customSelect}
            onChange={(value)=> setSelectedOption(value as SelectionPair)}
            options={clusterOptions}
            styles={customStyles}
            
            />
        </>
    )
}

export default RegionSelection