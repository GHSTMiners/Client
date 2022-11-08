import initSqlJs from 'sql.js';
import { useGlobalStore } from 'store';
import Config from 'config';

export default class DatabaseFacade {
  public db: any;
  public url?: string;
  private SQL: Promise<initSqlJs.SqlJsStatic>
  private sql_result!: initSqlJs.SqlJsStatic

  /**
   * Loads the database file from the server
   */
  constructor(url?:string) {
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
      };
      xhr.send();
    } else {
      console.log(`Failed to fetch database. URL: ${this.url}`)
      console.log(this.sql_result)
    }
  }

  public getPlayerDepth(playerId:number){
    let depthHistory: number[] = [];
    this.db.each("SELECT Value FROM Depth WHERE PlayerID = $playerId",{$playerId:playerId}, function(row:any){
      depthHistory.push(Math.round(row.Value/Config.blockHeight))
    });
    console.log(depthHistory)

    return depthHistory
  }


}

