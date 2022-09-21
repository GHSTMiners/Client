import { useEffect, useState } from 'react';
import Select from 'react-select';
import { ServerRegion } from 'chisel-api-interface/lib/ServerRegion';
import Client from 'matchmaking/Client'
import styles from './styles.module.css';
import selectStyle from './selectStyle'
import { useGlobalStore } from 'store';

type SelectionPair = { value: string, label:any}

const RegionSelection = () => {

    const [selectedOption, setSelectedOption ]= useState<SelectionPair>({} as SelectionPair)
    const [serverRegions,setServerRegions] = useState<ServerRegion[]>([]);
    const defaultRegion = useGlobalStore( state => state.region );

    useEffect(()=>{
        Client.getInstance().apiInterface.server_regions().then( serverRegions => {
            setServerRegions(serverRegions)
            setSelectedOption({value: defaultRegion?.name, 
                               label: formatFlagLabel(defaultRegion?.name,defaultRegion?.flag) } as SelectionPair)
        } )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[defaultRegion])


    function formatFlagLabel(name:string|undefined,imageURL:string|undefined):JSX.Element{
        return(
            <>
                <img src={ `https://chisel.gotchiminer.rocks/storage/${imageURL}` } 
                    style={{height: '2rem', padding: '0 0.5rem 0 0'}}
                    alt={name}
                    hidden={ defaultRegion? false: true }/> 
                {name}
            </>
        )
    }

    return(
        <>
            <Select
            value={selectedOption}
            className={styles.customSelect}
            onChange={(value)=> setSelectedOption(value as SelectionPair)}
            styles={selectStyle}
            options={serverRegions.map( region => {
                return(
                    {value: region.name, label: formatFlagLabel(region.name,region.flag) } as SelectionPair
                    ) 
                })}  
            />
        </>
    )
}

export default RegionSelection