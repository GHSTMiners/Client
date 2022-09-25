import { useEffect, useState } from 'react';
import Select from 'react-select';
import styles from './styles.module.css';
import selectStyle from './selectStyle'
import { useGlobalStore } from 'store';
import { ServerRegion } from 'chisel-api-interface/lib/ServerRegion';

type SelectionPair = { value: string, label:any}

const RegionSelection = () => {
    
    const serverRegions = useGlobalStore(store => store.serverRegions)
    const defaultRegion = useGlobalStore( state => state.region );
    const [selectedOption, setSelectedOption ]= useState<SelectionPair>({} as SelectionPair)
    const [isLoading,setLoading] = useState<boolean>(true);
    console.count('Rendering region selection===')
    
    useEffect(()=>{
        if (defaultRegion && defaultRegion.name){
            const defaultLabel: SelectionPair = { value: defaultRegion.name, label: formatLabel(defaultRegion) }
            setSelectedOption(defaultLabel)
            setLoading(false)
        }
    },[defaultRegion])

    function formatLabel(region:ServerRegion):JSX.Element{
        return(
            <>
                <img src={ region? `https://chisel.gotchiminer.rocks/storage/${region.flag}` : '' } 
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
            isSearchable={false}
            isLoading={isLoading}
            loadingMessage={() => "Loading..."}
            value={selectedOption}
            className={styles.customSelect}
            onChange={(value)=> setSelectedOption(value as SelectionPair)}
            styles={selectStyle}
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