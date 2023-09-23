import { AavegotchiObject } from "types";
import { Arrow } from "assets";
import { useEffect, useState, useCallback } from "react";
import gotchiLoading from "assets/gifs/loadingBW.gif";
import styles from "./styles.module.css";
import { SearchToggle, SortToggle, Sort  } from "components";
import Client from "matchmaking/Client";
import * as Protocol from "gotchiminer-multiplayer-protocol"
import GotchiPreview from "components/GotchiPreview";

const sortOptions = [
  {
    name: "BRS",
    value: "withSetsRarityScore",
  },
  {
    name: "ID",
    value: "gotchiId",
  },
  {
    name: "Name",
    value: "name",
  },
];

interface Props {
  /**
   * Array of gotchis to select from
   */
  gotchis?: Array<AavegotchiObject>;
  /**
   * Gotchi to initially select
   */
  initialGotchiId?: string;
  /**
   * Maximum gotchis visible in selector per scroll
   */
  maxVisible?: number;

  hidden?: boolean;
  /**
   * Callback function that triggers on gotchi select
   * @param {number} gotchiIndex - Aavegotchi index selected
   */
  selectGotchi: (gotchiId: string) => void;
}

export const GotchiSelector = ({
  gotchis,
  selectGotchi,
  initialGotchiId,
  maxVisible = 4,
  hidden = false,
}: Props) => {

  const [selected, setSelected] = useState<string>();
  const [currentIteration, setCurrentIteration] = useState(0);
  const [initGotchis, setInitGotchis] = useState<Array<AavegotchiObject>>();
  const [displayedGotchis, setDisplayedGotchis] =
    useState<Array<AavegotchiObject>>();
  /**
   * Maximum amount of times you can scroll down
   */
  const [maxIterations, setMaxIterations] = useState(
    gotchis
      ? gotchis.length - maxVisible < 0
        ? 0
        : gotchis.length - maxVisible
      : 0
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [sort, setSort] = useState<Sort>({
    val: "withSetsRarityScore",
    dir: "desc",
  });
  const [activeToggle, setActiveToggle] = useState<"search" | "sort" | undefined>();

  //const width = useWindowWidth();
  const isMobile = false; //width < 768;

  const handleSelect = useCallback(
    (id: string) => {
      if (id === selected) return;

      setSelected(id);
      selectGotchi(id);

    
    },
    [selectGotchi, selected]
  );

  useEffect(()=>{
    if(selected) {
      let message : Protocol.ChangeSelectedGotchi = new Protocol.ChangeSelectedGotchi();
      message.gotchiId = parseInt(selected)
      Client.getInstance().authenticationInfo.gotchiId = parseInt(selected)
      let serializedMessage : Protocol.Message = Protocol.MessageSerializer.serialize(message)
      if ( Client.getInstance().lobbyRoom){
        Client.getInstance().lobbyRoom.send(serializedMessage.name, serializedMessage.data)
      }
    }
  }, [selected])

  const handleScroll = (i: number) => {
    const nextIteration = currentIteration + i;
    if (nextIteration > maxIterations || nextIteration < 0) return;

    //playSound(click);
    setCurrentIteration(nextIteration);
  };

  const isSameGotchis = (
    newGotchis: Array<AavegotchiObject>,
    prevGotchis?: Array<AavegotchiObject>
  ) => {
    if (!prevGotchis) return false;
    return !newGotchis.find((gotchi, i) => gotchi.id !== prevGotchis[i].id);
  };

  const compareFunction = (
    a: AavegotchiObject,
    b: AavegotchiObject,
    options: Sort
  ) => {
    const { val, dir } = options;


    switch (val) {
      case "withSetsRarityScore":
        return (
          (dir === "asc" ? 1 : -1) *
          (a.withSetsRarityScore - b.withSetsRarityScore)
        );
      case "name":
        return (dir === "asc" ? 1 : -1) * (a.name < b.name ? -1 : 1);
      //case "highscore":
      //  return (dir === "asc" ? 1 : -1) * (getScore(a.id) - getScore(b.id));
      default:
        return 0;
    }
  };

  // Handle search & sort
  useEffect(() => {
    if (initGotchis && initGotchis?.length > 0) {
      const gotchis = [...initGotchis];
      const searchMatches = gotchis.filter(
        (gotchi) =>
          gotchi.id.includes(searchInput) ||
          gotchi.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      const sortedMatches = searchMatches.sort((a, b) =>
        compareFunction(a, b, sort)
      );
      setCurrentIteration(0);
      setMaxIterations(
        searchMatches.length - maxVisible < 0
          ? 0
          : searchMatches.length - maxVisible
      );
      setDisplayedGotchis(sortedMatches);
    }
  }, [searchInput, initGotchis, sort, maxVisible]);

  useEffect(() => {
    if (gotchis && gotchis.length >0 ) {
      if (isSameGotchis(gotchis, initGotchis)) return;
      setInitGotchis(gotchis);
      handleSelect(initialGotchiId || gotchis[0].id);
    } 
  }, [gotchis, initialGotchiId, handleSelect,initGotchis]);

  return (
    <div className={styles.gotchiSelector} hidden={hidden}>
      <div className={styles.filterOptions}>
        <SearchToggle
          onToggle={() => activeToggle !== "search" ? setActiveToggle("search") :  setActiveToggle(undefined)}
          activeOverride={isMobile ? activeToggle === "search" : undefined}
          placeholder="Token ID or Name"
          onChange={setSearchInput}
        />
        <SortToggle
          onToggle={() => activeToggle !== "sort" ? setActiveToggle("sort") :  setActiveToggle(undefined)}
          activeOverride={isMobile ? activeToggle === "sort" : undefined}
          options={sortOptions}
          onSelect={setSort} selected={sort}
        />
      </div>
      <div className={styles.selectorContainer}>
        <Arrow
          style={{width:'4rem'}}
          className={`${styles.chevron} ${styles.up} ${
            currentIteration === 0 ? styles.disabled : styles.enabled
          }`}
          onClick={() => handleScroll(-1)}
        />
        <div
          className={styles.selectorWrapper}
          style={
            isMobile
              ? { width: `${maxVisible * 7.2 + 1.6}rem` }
              : { height: `${maxVisible * 6.8}rem` }
          }
        >
          <div
            className={styles.selector}
            style={
              isMobile
                ? { transform: `translateX(-${currentIteration * 8}rem)` }
                : { transform: `translateY(-${currentIteration * 7}rem)` }
            }
          >
            {gotchis === undefined
              ? new Array(3).fill("").map((_, i) => (
                  <div className={styles.loadingContainer} key={i}>
                    <img src={gotchiLoading} alt={`Loading gotchi ${i}`} />
                  </div>
                ))
              : displayedGotchis?.map((gotchi, i) => {
                  const isSelected = selected === gotchi.id;
                  
                  return (
                    <div
                      className={`${styles.gotchiContainer} ${
                        isSelected
                          ? `${styles.selected}`
                          : ""
                      }`}
                      key={i}
                      onClick={() => {
                        //playSound(click);
                        handleSelect(gotchi.id);
                      }}
                    >
                        <GotchiPreview tokenId={gotchi.id}  />
                    </div>
                  );
                })}
          </div>
        </div>
        <Arrow
          style={{width:'4rem'}}
          className={`${styles.chevron} ${styles.down} ${
            currentIteration === maxIterations
              ? styles.disabled
              : styles.enabled
          }`}
          onClick={() => handleScroll(1)}
        />
      </div>
    </div>
  );
};
