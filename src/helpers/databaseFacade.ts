import initSqlJs from 'sql.js';

export default class DatabaseFacade {
  public database: any;
  public isReady: boolean = false;
  public isLoaded: boolean = false;
  public onLoadCallback!: (() => void);
  private SQL: any

  /**
   * Loads the database file from the server
   */
  constructor() {
    var self = this;
     // @ts-ignore: Let's ignore a compile error like this unreachable code 
    self.SQL = initSqlJs({
      locateFile: (file:any) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.1/sql-wasm.wasm`
    }).then( () => this.isReady = true );
  }

  public fetchDatabase(url:string){
    if (this.isReady){
      console.log(`[DatabaseFacade] About to fetch database url: ${url}`)
      // Fetch base database from server
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url , true);
      xhr.responseType = 'arraybuffer';

      xhr.onload = e => {
        // When database file is downloaded, open and load
        const uInt8Array = new Uint8Array(xhr.response);
        this.database = new this.SQL.Database(uInt8Array);
      
        //Log that database is loaded, and call onDataBaseLoaded callback if is set
        console.log("Game log database was loaded 🥳")
        this.isLoaded = true;
        this.onLoadCallback();
      };
      xhr.send();
    } else {
      console.log(`[DatabaseFacade] Not ready to fetch the requested URL ${url}`)
    }
  }



}

