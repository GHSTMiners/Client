import initSqlJs from 'sql.js';
import { useGlobalStore } from 'store';
import Config from 'config';
import { IndexedArray, ScatteredData } from 'types';
import { DatabaseTables } from './vars';

export default class DatabaseFacade {
  public db: any;
  public url?: string;
  private SQL: Promise<initSqlJs.SqlJsStatic>
  private sql_result!: initSqlJs.SqlJsStatic
  private refTime0: number;

  /**
   * Loads the database file from the server
   */
  constructor(url?:string) {
    this.refTime0 = 0;
     // @ts-ignore: Let's ignore a compile error like this unreachable code 
    this.SQL = initSqlJs({
      locateFile: (file:any) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm`
    }).then( sql_result => this.sql_result = sql_result );
  }

  public setUrl( url:string){
    this.url = url;
    this.SQL.then(()=> this.fetchDatabase()) ;
  }

  public fetchDatabase(){
    if (this.url && this.sql_result ){
      console.log(`Fetching game statistics database from url: ${this.url}`)
      // Fetch base database from server
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.url as string, true);
      xhr.responseType = 'arraybuffer';

      xhr.onload = e => {
        // When database file is downloaded, open and load
        const uInt8Array = new Uint8Array(xhr.response);
        this.db = new this.sql_result.Database(uInt8Array);
              
        //Log that database is loaded, and call onDataBaseLoaded callback if is set
        console.log("Game log database was loaded 🥳")
        useGlobalStore.getState().setIsDatabaseLoaded(true);
        this.getTime0();
      };
      xhr.send();
    } else {
      console.log(`Failed to fetch database. URL: ${this.url}`)
      useGlobalStore.getState().setIsDatabaseAvailable(false);
    }
  }

  public getScatteredData(playerId:number,table:DatabaseTables):ScatteredData[]{
    let data: ScatteredData[] = [];
    this.db.each(`SELECT * FROM ${table} WHERE PlayerID = $playerId`,{$playerId:playerId}, (row:any) => {
      const dataPoint: ScatteredData = { 
        x : this.normalizeTimestamp(row.Time), 
        y:  this.formatData(row.Value,table),
      }
      data.push(dataPoint)
    });
    return data 
  }

  public getPlayerDeaths (playerId:number,table:DatabaseTables):ScatteredData[]{
    let data: ScatteredData[] = [];
    let timestamps: number[] = [];
    this.db.each("SELECT Time FROM Events WHERE PlayerID = $playerId",{$playerId:playerId}, (row:any) => {
      timestamps.push(  row.Time ) // time in seconds from start
    });
    timestamps.forEach( timestamp => {
      const closestValue = this.db.exec(`
        SELECT Value FROM ${table} 
        WHERE PlayerID = $playerId
        ORDER BY ABS( Time - ${timestamp} ) 
        LIMIT 1`,{$playerId:playerId});
      const dataPoint: ScatteredData = { 
        x : this.normalizeTimestamp(timestamp), 
        y:  this.formatData(closestValue[0].values[0],table),
      }
      data.push(dataPoint);
    })
    return data
  }
  
  private formatData(value:number,table:DatabaseTables):number{
    switch(table){
      case DatabaseTables.Depth:
        return( Math.round(value/Config.blockHeight) )
      default:
        return( value )
    }
  }

  private normalizeTimestamp( timestamp: number ){
    return  (timestamp - this.refTime0) /1000 
  }

  private getTime0(){
    const refTimeEntry = this.db.exec("SELECT Time FROM Depth WHERE ID = 1");
    this.refTime0 = refTimeEntry[0].values[0]; 
  }

  public getPlayers(){
    let players : IndexedArray = {};
    this.db.each("SELECT * from Players", function( row:any){
      players[row.ID] = row.GotchiID;
    });
    return players
  }

}

