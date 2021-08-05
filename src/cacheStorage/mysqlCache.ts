import mysql, { RowDataPacket } from 'mysql2/promise';
import SQL from 'sql-template-strings';
import { Config } from '../config';
import { ImageInfo } from './types';

export class MySQLCacheStorage {

  private mysqlConnection: Promise<mysql.Connection> | mysql.Connection;

  private async getMysqlConnection(): Promise<mysql.Connection> {
    if(this.mysqlConnection instanceof Promise) {
      return await this.mysqlConnection; // keep awaiting if still promise
    }
    return this.mysqlConnection; // or return immediatly if value is available
  }

  private async initialize(): Promise<mysql.Connection> {
    for(;;) {
      try {
        const connectionPromise = mysql.createConnection({
          host: Config.MySQL.Host,
          user: Config.MySQL.User,
          password: Config.MySQL.Password,
          database: Config.MySQL.Database,
        });
  
        const connection = await connectionPromise;
  
        await connection.query(`
          CREATE TABLE IF NOT EXISTS image_cache (
            url VARCHAR(256) NOT NULL,
            date DOUBLE NOT NULL,
            image_blob LONGBLOB NOT NULL,
            PRIMARY KEY (url)
          )
          COLLATE='latin1_swedish_ci'
          ENGINE=InnoDB
          ROW_FORMAT=DYNAMIC
          ;
        `);
  
        this.mysqlConnection = connection; // replace promise with resolved value
        return connection;
      } catch(e) {
        console.log(`Got error while connecting to MySQL: ${e}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2000ms and try again
        console.log('Reattempting...');
      }
    }
  }

  constructor() {
    this.mysqlConnection = this.initialize();
  }

  async getCachedImageDate(url: string): Promise<number | undefined> {
    const connection = await this.getMysqlConnection();

    const queryResult = await connection.query<RowDataPacket[]>(SQL`SELECT date FROM image_cache WHERE url = ${url}`);
    const rows = queryResult[0];

    if(rows.length <= 0) {
      return undefined;
    }

    return rows[0].date;
  }

  async getCachedImageBuffer(url: string): Promise<Buffer | undefined> {
    const connection = await this.getMysqlConnection();

    const queryResult = await connection.query<RowDataPacket[]>(SQL`SELECT image_blob FROM image_cache WHERE url = ${url}`);
    const rows = queryResult[0];

    if(rows.length <= 0) {
      return undefined;
    }

    return rows[0].image_blob;
  }

  async deleteCachedImage(url: string): Promise<boolean> {
    const connection = await this.getMysqlConnection();

    const queryResult = await connection.query<mysql.OkPacket>(SQL`DELETE FROM image_cache WHERE url = ${url}`);
    return queryResult[0].affectedRows !== 0;
  }

  async listImages(): Promise<ImageInfo[]> {
    const connection = await this.getMysqlConnection();

    const queryResult = await connection.query<RowDataPacket[]>('SELECT url, date FROM image_cache');
    return queryResult[0].map(
      ({url, date}) => ({url, date})
    );
  }

  async saveImageInCache(url: string, buffer: Buffer): Promise<void> {
    const connection = await this.getMysqlConnection();

    await connection.query(SQL`
      INSERT INTO image_cache (url, date, image_blob) VALUES (${url}, ${Date.now()}, ${buffer})
        ON DUPLICATE KEY UPDATE date = ${Date.now()}, image_blob = ${buffer};
    `);
  }
}
