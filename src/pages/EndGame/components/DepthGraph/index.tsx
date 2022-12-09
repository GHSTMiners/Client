import styles from "./styles.module.css";
import globalStyles from "theme/globalStyles.module.css";
import Chart from 'chart.js/auto';
import { registerables } from "chart.js";
import { Scatter } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
import Client from "matchmaking/Client";
import { useGlobalStore } from "store";
import { GraphData, GraphEntry, SelectionPair } from "types";
import chroma from "chroma-js"
import { DatabaseTables } from "helpers/vars";
import { linePlotOptions } from "./displayOptions"
import deathGotchiIcon from "assets/icons/deathGhost.svg"
import Select from 'react-select';
import selectStyle from 'theme/selectStyle'

Chart.register(...registerables);
Chart.defaults.font.size=14;
Chart.defaults.color='rgba(255, 255, 255, 0.7)';


export const DepthGraph = () => {
  const isDatabaseLoaded = useGlobalStore( state => state.isDatabaseLoaded );
  const gotchiNames = useGlobalStore( state => state.gotchiNames);
  const isDatabaseAvailable = useGlobalStore( state => state.isDatabaseAvailable);
  const [ graphData , setGraphData ] = useState<GraphData>({} as GraphData);
  const [ graphOptions , setGraphOptions ] = useState(linePlotOptions);
  const selectRef = useRef(null);
  const [selectedTableData, setSelectedOption ]= useState<DatabaseTables>(DatabaseTables.Depth);
  const selectionOptions = [ DatabaseTables.Depth, DatabaseTables.Crypto, DatabaseTables.Cargo, DatabaseTables.Fuel, DatabaseTables.Health ];


  useEffect(()=>{
    if (isDatabaseLoaded && gotchiNames ){
      const graphDatasets: GraphEntry[] = [];
      const players = Client.getInstance().databaseFacade.getPlayers();
      const playerColors = chroma.scale(['#fafa6e','#2A4858']).mode('lch').colors(5);
      let markerIcon = new Image();
      markerIcon.src = deathGotchiIcon;
      markerIcon.width = 20;
      markerIcon.height = 20;
      
      Object.keys(players).forEach( (playerID,i) => {
        const rawPlayerData = Client.getInstance().databaseFacade.getScatteredData( +playerID, selectedTableData );
        const playerDeaths = Client.getInstance().databaseFacade.getPlayerDeaths( +playerID, selectedTableData );

        const deathDataset = { 
          label: 'deathEventDataset',
          data: playerDeaths,
          showLine: false,
          pointStyle: markerIcon,
        };
        graphDatasets.push(deathDataset);

        const playerData = { 
          label: gotchiNames[players[playerID]],
          data: rawPlayerData,
          showLine: true,
          radius: 0,
          borderColor: playerColors[i],
          tension: 0.2,
        };
        graphDatasets.push(playerData);

      })
      setGraphData( { datasets: graphDatasets } )
    } 
  },[isDatabaseLoaded,gotchiNames,selectedTableData])

  function updateSelection(option:DatabaseTables){
    (option===DatabaseTables.Depth)? graphOptions.scales.y.reverse = true : graphOptions.scales.y.reverse = false; 
    setGraphOptions(state => { return {...state} })
    setSelectedOption(option)
  }

  function databaseTable2selection(databaseTable:DatabaseTables):SelectionPair{
    return {value: databaseTable, label: databaseTable}
  }
  
  return (
      <>
        <div className={styles.selectContainer}>
          <Select
              ref={selectRef}
              isSearchable={false}
              isLoading={!isDatabaseAvailable}
              loadingMessage={() => "Loading..."}
              value={databaseTable2selection(selectedTableData)}
              defaultValue={databaseTable2selection(selectedTableData)}
              className={globalStyles.customSelect}
              onChange={(option)=> {updateSelection(option?.value as DatabaseTables); }}
              styles={selectStyle}
              openMenuOnFocus
              options={selectionOptions.map( option => {
                return databaseTable2selection(option)
                })}  
              />
        </div>
        <div className={styles.graphContainer}>
          { isDatabaseAvailable? 
               ( graphData.datasets? 
                <> 
                  <Scatter data={graphData} options={graphOptions} />
                </>
                  : null )
              :<div className={styles.graphUnavailable}>
                This data is not yet available. Next time try not to leave your frens behind before the game finishes!
              </div>
          }
        </div>
      </>
  );
};