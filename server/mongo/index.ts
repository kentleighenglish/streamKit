import { MongoClient, Db } from "mongodb";
import debugFunc from "debug";
import { map } from "lodash";

import { MongoResponse, CollectionConfig } from "@/types/mongo";

const debug = debugFunc("db:utils");
const debugError = debugFunc("db:error");

const DB_NAME = "streamkit";

const { MONGO_URI } = process.env;

const collections: { [key: string]: CollectionConfig } = {
  sets: {},
};

const run = async (query: (db: Db) => Promise<any>): Promise<MongoResponse> => {
  try {
    const client: MongoClient = await MongoClient.connect(MONGO_URI, {
      sslValidate: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      tlsAllowInvalidHostnames: true,
    });

    const db: Db = client.db(DB_NAME);

    const response = await query(db);

    await client.close();

    return response;
  } catch (e) {
    debugError(e);
    return false;
  }
};

const assertCollection = async (collection: string, db = DB_NAME) => {
  const collectionList = await run((db: Db) => db.collections());

  if (!map(collectionList, "namespace").includes(`${DB_NAME}.${collection}`)) {
    await run((db) => db.createCollection(collection));
    debug(`Collection Created: ${collection}`);
  }
  const { secondaryIndices = [] } = collections[collection] || {};
  await Promise.all(
    secondaryIndices.map(async (index: string) => {
      try {
        if (typeof index === "string") {
          await run((db: Db) =>
            db.collection(collection).createIndex({ [index]: 1 })
          );
        }
      } catch (e) {
        debugError(
          `Failed creating index on ${collection} with field ${index}. `,
          e
        );
      }
    })
  );
};

const assertAllCollections = async (db = DB_NAME) => {
  await Promise.all(
    Object.keys(collections).map(async (key) => await assertCollection(key, db))
  );
};

module.exports = {
  run,
  assertCollection,
  assertAllCollections,
  DB_NAME,
};
