import { Db, GridFSBucket, GridFSBucketWriteStream, MongoClient, MongoClientOptions, ObjectId } from "mongodb";
import * as mongoUri from "mongodb-uri";
import { StorageEngine } from "multer";
import { randomBytes } from "crypto";
import isPromise from "is-promise";
import * as pump from "pump";

import { GridFile, ConnectionResult, NodeCallback, UrlStorageOptions, DbStorageOptions } from "./types";
import { getDatabase } from "./utils";

const defaults: any = {
  metadata: null,
  chunkSize: 261_120,
  bucketName: "fs",
  aliases: null,
};

export class GridFsStorage implements StorageEngine {
  db: Db = null;
  client: MongoClient = null;
  configuration: DbStorageOptions | UrlStorageOptions;
  connected = false;
  connecting = false;
  error: any = null;
  private readonly _options: any;

  constructor(configuration: UrlStorageOptions | DbStorageOptions) {
    if (!configuration || (!(configuration as UrlStorageOptions).url && !(configuration as DbStorageOptions).db)) {
      throw new Error("Error creating storage engine. At least one of url or db option must be provided.");
    }

    this.configuration = configuration;

    const { url, options }: UrlStorageOptions = this.configuration as UrlStorageOptions;

    if (url) {
      this._options = options;
    }

    this._connect();
  }

  static async generateBytes(): Promise<{ filename: string }> {
    return new Promise((resolve, reject) => {
      randomBytes(16, (error, buffer) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({ filename: buffer.toString("hex") });
      });
    });
  }

  async ready(): Promise<ConnectionResult> {
    if (this.error) {
      throw this.error;
    }

    if (this.connected) {
      return { db: this.db, client: this.client };
    }

    return new Promise((resolve, reject) => {
      const checkConnection = () => {
        if (this.error) {
          reject(this.error);
        } else if (this.connected) {
          resolve({ db: this.db, client: this.client });
        } else {
          setTimeout(checkConnection, 100);
        }
      };

      checkConnection();
    });
  }

  _handleFile(_: Express.Request, file: Express.Multer.File, cb: NodeCallback): void {
    if (this.connecting) {
      this.ready()
        .then(async () => this.fromFile(file))
        .then((file) => {
          cb(null, file);
        })
        .catch(cb);
      return;
    }

    this._updateConnectionStatus();

    if (this.connected) {
      this.fromFile(file)
        .then((file) => {
          cb(null, file);
        })
        .catch(cb);
      return;
    }

    cb(new Error("The database connection must be open to store files"));
  }

  _removeFile(_: Express.Request, file: Express.Multer.File, cb: NodeCallback): void {
    if (!file.id) throw Error("Invalid file ID");
    const bucket = new GridFSBucket(this.db);
    bucket.delete(file.id);
  }

  async fromFile(file: Express.Multer.File): Promise<GridFile> {
    if (this.connecting) {
      await this.ready();
    }

    return this.fromStream(file.stream, file);
  }

  async fromStream(readStream: NodeJS.ReadableStream, file: Express.Multer.File): Promise<GridFile> {
    return new Promise<GridFile>((resolve, reject) => {
      readStream.on("error", reject);
      this.fromMulterStream(readStream, file).then(resolve).catch(reject);
    });
  }

  private _connect() {
    const { db, client = null } = this.configuration as DbStorageOptions<Db>;

    if (db && !isPromise(db) && !isPromise(client)) {
      this._setDb(db, client);
      return;
    }

    this._resolveConnection()
      .then(({ db, client }) => {
        this._setDb(db, client);
      })
      .catch((error) => {
        this._fail(error);
      });
  }

  private async _resolveConnection(): Promise<ConnectionResult> {
    this.connecting = true;
    const { db, client = null } = this.configuration as DbStorageOptions<Db>;
    if (db) {
      const [_db, _client] = await Promise.all([db, client]);
      return { db: _db, client: _client };
    }

    return this._createConnection();
  }

  private async _createConnection(): Promise<ConnectionResult> {
    const { url } = this.configuration as UrlStorageOptions;
    const options: MongoClientOptions = this._options;

    try {
      const { db, client } = await this._openConnection(url, options);

      return { db, client };
    } catch (error: unknown) {
      throw error;
    }
  }

  protected async _openConnection(url: string, options: MongoClientOptions): Promise<ConnectionResult> {
    let client = null;
    let db;
    const connection = await MongoClient.connect(url, options);
    if (connection instanceof MongoClient) {
      client = connection;
      const parsedUri = mongoUri.parse(url);
      db = client.db(parsedUri.database);
    } else {
      db = connection;
    }

    return { client, db };
  }

  private _setDb(db: Db, client?: MongoClient): void {
    this.connecting = false;
    this.db = getDatabase(db);

    if (client) {
      this.client = client;
    }

    this._updateConnectionStatus();
  }

  private _fail(error: any): void {
    this.connecting = false;
    this.db = null;
    this.client = null;
    this.error = error;
    this._updateConnectionStatus();
  }

  private _updateConnectionStatus(): void {
    this.connected = !!this.db;
    this.connecting = !this.connected;
  }

  private async fromMulterStream(readStream: NodeJS.ReadableStream, file: Express.Multer.File): Promise<GridFile> {
    const streamOptions = await GridFsStorage._mergeProps(
      { contentType: file.mimetype },
      {
        ...file,
        filename: file.originalname,
        id: new ObjectId(),
      },
    );

    return new Promise((resolve, reject) => {
      const writeStream = this.createStream(streamOptions);

      writeStream.on("error", reject);
      writeStream.on("finish", (fileResult: GridFile) => {
        if (fileResult) {
          resolve(fileResult);
        }

        reject();
      });

      pump([readStream, writeStream]);
    });
  }

  private static async _mergeProps(extra: { contentType: any }, fileSettings: any): Promise<any> {
    const previous: any = await (fileSettings.filename ? { filename: fileSettings.filename } : GridFsStorage.generateBytes());

    if (fileSettings.id) {
      previous.id = new ObjectId();
    }

    return { ...previous, ...defaults, ...extra, ...fileSettings };
  }

  createStream(options): GridFSBucketWriteStream {
    const settings = {
      id: options.id,
      chunkSizeBytes: options.chunkSize,
      contentType: options.contentType,
      metadata: options.metadata,
      aliases: options.aliases,
      disableMD5: options.disableMD5,
    };
    const gfs = new GridFSBucket(this.db, { bucketName: options.bucketName });
    return gfs.openUploadStream(options.filename, settings);
  }
}

export const GridFsStorageCtr = new Proxy(GridFsStorage, {
  apply(target, thisArg, argumentsList) {
    // @ts-expect-error
    return new target(...argumentsList); // eslint-disable-line new-cap
  },
});
