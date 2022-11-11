import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import styles from './styles.module.css';
import selectStyle from './selectStyle'
import { useGlobalStore } from 'store';
import { ServerRegion } from 'chisel-api-interface/lib/ServerRegion';
import Config from 'config';

type SelectionPair = { value: string, label:any}

const RegionSelection = () => {
    
    const serverRegions = useGlobalStore( state => state.serverRegions)
    const setRegion = useGlobalStore( state => state.setRegion)
    const selectedRegion = useGlobalStore( state => state.region );
    const [selectedOption, setSelectedOption ]= useState<SelectionPair>({} as SelectionPair)
    const [isLoading,setLoading] = useState<boolean>(true);
    const selectRef = useRef(null);
    
    useEffect(()=>{
        if (selectedRegion && selectedRegion.name){
            const updatedLabel: SelectionPair = { value: selectedRegion.name, label: formatLabel(selectedRegion) }
            setSelectedOption(updatedLabel)
            setLoading(false)
        }
    },[selectedRegion])
    
    function updateRegion( regionEntry: SelectionPair ){
        setSelectedOption( {...regionEntry} )
        const region = serverRegions.find( region => region.name === regionEntry.value )
        if (region){
            setRegion(region)
        }
    }

    function formatLabel(region:ServerRegion):JSX.Element{
        return(
            <>
                <img src={ region? `${Config.storageURL}/${region.flag}` : '' } 
                    style={{height: '2rem', padding: '0 0.5rem 0 0'}}
                    alt={region?.name}
                    hidden={ region? false: true }/> 
                {region.name}
            </>
        )
    }

    return(
        <>
            <Select
            ref={selectRef}
            isSearchable={false}
            isLoading={isLoading}
            loadingMessage={() => "Loading..."}
            value={selectedOption}
            defaultValue={selectedOption}
            className={styles.customSelect}
            onChange={(value)=> {updateRegion(value as SelectionPair); }}
            styles={selectStyle}
            openMenuOnFocus
            options={serverRegions.map( region => {
                return(
                    {value: region.name, label: formatLabel(region) } as SelectionPair
                    ) 
                })}  
            />
        </>
    )
}

export default RegionSelection