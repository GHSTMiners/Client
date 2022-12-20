import styles from "./styles.module.css";
import TopPlayersIcon2 from "assets/icons/top_players.svg"
import GotchiPreview from "components/GotchiPreview";
import { ChangeEvent, useEffect, useState } from "react";
import Client from "matchmaking/Client"
import { StatisticCategory } from "chisel-api-interface/lib/Statistics";
import { formatHighScoreData } from "helpers/aavegotchi"
import { number } from "mathjs";
import { HighScore } from "types";
import { SpinnerCircular } from "spinners-react";

interface Props {
  title?: string;
  icon?: string; 
}

export const DailyWinners = ({ title="Daily Top Players", icon }: Props ) => {

  const [isLoading, setIsLoading] = useState(true);
  const [categories,setCategories] = useState<StatisticCategory[]>([]);
  const [renderedCategories,setRenderedCategories] = useState<JSX.Element[]>([]);
  const [selectedCategory,setSelectedCategory] = useState<StatisticCategory>({});
  const [highscores,setHighscores] = useState<HighScore[]>([]);
  

  // Component to convert Chisel data into React Select options
  const renderSelectElement = ( key:string, id: number | string, tag:string) => {
    return <option key={key} value={id}>{tag}</option>
  }

  useEffect(()=>{
    Client.getInstance().apiInterface.statistic_categories()
    .then( categories => {

      setCategories(categories);

      const renderedCategories = categories.map(
        function(categoryObj) { 
          return renderSelectElement(categoryObj.name as string, categoryObj.id as number, categoryObj.name as string) 
         }
      )
      .filter( element => (element.key !== 'Playtime') ) 
      .filter( element => (element.key !== 'Deaths'))
      .filter( element => (element.key !== 'Amount spent on upgrades') ); 

      setRenderedCategories(renderedCategories);
    });
    // Default category to show after the list is loaded
    setSelectedCategory( {id:3, name:'Endgame crypto'} );      
  },[])


  useEffect(()=>{
    if ( selectedCategory.id ){
      Client.getInstance().apiInterface.daily_highscores(selectedCategory)
      .then( dailyHighscore => {
        const uniqueHighscores = [...new Map(dailyHighscore.map(item => [item.gotchi['gotchi_id'], item])).values()];
        const sortedHighscores = uniqueHighscores.sort((entry1,entry2)=> entry2.value - entry1.value).slice(0,3);
        formatHighScoreData( sortedHighscores.map(entry => `${entry.gotchi.gotchi_id}` ) , sortedHighscores.map(entry => entry.value ) )
        .then( highScoreWithNames => {
          setHighscores( highScoreWithNames )
          setIsLoading(false) 
        }) ;
      })
    }
  },[renderedCategories,selectedCategory])

       // Updating component of the drop-down select cathegory element
  const updateCathegory = (event: ChangeEvent<HTMLSelectElement>) => {
    if (categories){
      let selectedId = number(event.target.value) as number;
      let selectedName = categories.find( element => element.id === selectedId)?.name;
      if (selectedName){
        const requestedCathegory: StatisticCategory= {id:selectedId, name:selectedName};
        setSelectedCategory(requestedCathegory);
      }
    }
  }

  const renderGotchi = (tokenId:string,name:string,score:number)=>{
  //options={{ animate: true, removeBg: true }} 
    return(
      <div className={styles.playerContainer}>
        <div className={styles.gotchiContainer}>
          <GotchiPreview tokenId={tokenId}  />
        </div>
        <div className={styles.gotchiName}>{name}</div>
        <div className={styles.gotchiScore}>{score}</div>
      </div>
    )
  }
  return (
    <div className={styles.infoPanel}>
        <div className={styles.tileHeader}>
          <div className={styles.infoTitle}> {title} </div>
          <img src={TopPlayersIcon2} className={styles.tileIcon} alt={'Daily Winers Icon'}/> 
        </div>
        <select value={selectedCategory?.id} 
                onChange={(e)=>updateCathegory(e)} 
                className={styles.selectDropdown} >
                {renderedCategories}
        </select>
        <div className={styles.winnersContainer}>
          {(highscores.length>0)? 
          renderGotchi(`${highscores[0].tokenId}`,highscores[0].name,highscores[0].score) 
          : isLoading?  <SpinnerCircular color={'ffffff'}/> :<div className={styles.noHighscores}> Nobody achieved a highscore in this category today, are you ready for the challenge? </div> }
          {(highscores.length>1)? renderGotchi(`${highscores[1].tokenId}`,highscores[1].name,highscores[1].score) : null}
          {(highscores.length>2)? renderGotchi(`${highscores[2].tokenId}`,highscores[2].name,highscores[2].score) : null}
        </div>
    </div>
  );
};