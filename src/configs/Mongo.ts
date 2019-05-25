import { MongoClient } from "mongodb";
import { environment } from "../environments/environment";

export const mongoURI = environment.MONGODB_URI;
export const databaseName = environment.MONGODB_DB_NAME;

export namespace Mongo {
  export function setup() {
    MongoClient.connect(mongoURI, (err, dbConnection) => {
      console.log("Successfully connected to mongo server!");
    });
  }
}
