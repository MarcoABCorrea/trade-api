import QueryParameters from "../models/QueryParameters";
import { databaseName } from "../configs/Mongo";
import { ObjectId } from "mongodb";

export namespace Helpers {
  /**
   * Purpose: Searches for collection instance
   * @param err
   * @param result
   */
  export function fetchCollection(err, result): void {
    !err
      ? console.log(`Collection ${result.s.name} found`)
      : console.error("Error while searching for collection! ", err);
  }

  export function _fetchAll(
    dbConnection,
    collectionName: string,
    queryParams: any,
    id?: any
  ) {
    const options = Helpers.formatQueryParams(queryParams);
    if (id) {
      options.query.user = id;
    }
    const promise = new Promise((resolve, reject) => {
      dbConnection
        .db(databaseName)
        .collection(collectionName, this.fetchCollection)
        .find(options.query)
        .project(options.projection)
        .skip(options.skip)
        .limit(options.limit)
        .sort(options.sort)
        .toArray()
        .then(
          result => {
            resolve(result);
          },
          err => {
            reject(err);
          }
        );
    });

    if (options.embed === "") {
      return promise;
    } else {
      return this._fetchAllEmbed(promise, dbConnection, options.embed, id);
    }
  }

  export function _fetchAllEmbed(promise, dbConnection, embed, id) {
    return new Promise(resolve => {
      promise.then(resAll => {
        const embedPromise = new Promise((resolve, reject) => {
          dbConnection
            .db(databaseName)
            .collection(embed, this.fetchCollection)
            .findOne({ _id: new ObjectId(id) })
            .then(
              result => {
                resolve(result);
              },
              err => {
                reject(err);
              }
            );
        });

        embedPromise.then(response => {
          resAll.map(entity => {
            entity[embed] = response;
          });
          resolve(resAll);
        });
      });
    });
  }

  export function _fetchById(dbConnection, collectionName, id, embed?) {
    const promise = new Promise(resolve => {
      dbConnection
        .db(databaseName)
        .collection(collectionName, this.fetchCollection)
        .findOne({ _id: id })
        .then(result => {
          resolve(result);
        });
    });

    if (embed) {
      return this._addEmbedResult(promise, dbConnection, embed);
    } else {
      return promise;
    }
  }

  export function _addEmbedResult(promise, dbConnection, embed) {
    return new Promise(resolve => {
      promise.then(res => {
        if (res[embed] instanceof Array) {
          dbConnection
            .db(databaseName)
            .collection(embed, this.fetchCollection)
            .find({ _id: { $in: res[embed] } })
            .toArray()
            .then(result => {
              if (result && result.length > 0) {
                res[embed] = result;
              }
              resolve(res);
            });
        } else {
          resolve(res);
        }
      });
    });
  }

  export function _create(dbConnection, collectionName, payload) {
    return new Promise((resolve, reject) => {
      dbConnection
        .db(databaseName)
        .collection(collectionName, this.fetchCollection)
        .insertOne(payload)
        .then(
          result => {
            resolve(result);
            dbConnection.close();
          },
          err => {
            reject(err);
            dbConnection.close();
          }
        );
    });
  }

  export function _update(dbConnection, collectionName, id, payload) {
    return new Promise((resolve, reject) => {
      dbConnection
        .db(databaseName)
        .collection(collectionName, this.fetchCollection)
        .updateOne({ _id: id }, { $set: payload }, { upsert: false })
        .then(
          result => {
            resolve(result);
            dbConnection.close();
          },
          err => {
            reject(err);
            dbConnection.close();
          }
        );
    });
  }

  export function _remove(dbConnection, collectionName, id) {
    return new Promise((resolve, reject) => {
      dbConnection
        .db(databaseName)
        .collection(collectionName, this.fetchCollection)
        .deleteOne({ _id: id })
        .then(
          result => {
            resolve(result);
            dbConnection.close();
          },
          err => {
            reject(err);
            dbConnection.close();
          }
        );
    });
  }

  export function _removeAll(dbConnection, collectionName) {
    return new Promise((resolve, reject) => {
      dbConnection
        .db(databaseName)
        .collection(collectionName, this.fetchCollection)
        .remove({})
        .then(
          result => {
            resolve(result);
            dbConnection.close();
          },
          err => {
            reject(err);
            dbConnection.close();
          }
        );
    });
  }

  /**
   * Purpose: Builds MongoDB query based on QueryParameters
   * @param queryParams
   * @returns {{}}
   * @private
   */
  export function _formatQuery(queryParams: QueryParameters) {
    let queryObj = {};
    const invalidFields = QueryParameters.describe();
    for (let property in queryParams) {
      if (
        queryParams.hasOwnProperty(property) &&
        invalidFields.indexOf(property) === -1
      ) {
        queryObj[property] = queryParams[property];
      }
    }

    return queryObj;
  }

  /**
   * Purpose: Formats the params list for MongoDB
   * @param {string} params
   * @param value
   * @returns {{}}
   * @private
   */
  export function _formatParams(params: string, value: any) {
    const paramsArray = params ? params.split(",") : ([] as string[]);
    const paramsObject = {};

    paramsArray.map(fieldName => {
      paramsObject[fieldName] = value;
    });

    return paramsObject;
  }

  /**
   * Purpose: Configures an object containing all MongoDB query properties
   * @param queryParams
   * @returns {}
   */
  export function formatQueryParams(queryParams: QueryParameters) {
    let projection = {};

    if (queryParams.fields || queryParams.omitFields) {
      const show = !!queryParams.fields;
      projection = this._formatParams(
        queryParams.fields || queryParams.omitFields,
        show
      );
    }

    let sort = {};

    if (queryParams.asc || queryParams.desc) {
      const direction = queryParams.asc ? 1 : -1;
      sort = this._formatParams(queryParams.asc || queryParams.desc, direction);
    }

    const query = this._formatQuery(queryParams);
    const skip = Number(queryParams.skip) || 0;
    const limit = Number(queryParams.limit) || 10;
    const embed = queryParams.embed || "";

    return {
      query: query,
      projection: projection,
      skip: skip,
      limit: limit,
      sort: sort,
      embed: embed
    };
  }
}
