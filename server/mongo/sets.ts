import { Set, OptionalSet } from "@/types/sets";
import debug from "../debug";
import { run } from "./_utils";

const COLLECTION = "sets";

const initialSet: OptionalSet = {
  layers: 1,
  slides: 1,
  cells: [],
};

export const createSet = async (set: OptionalSet): Promise<string | null> => {
  try {
    const response = await run(
      (db) =>
        new Promise((resolve, reject) =>
          db.collection(COLLECTION).insertOne(
            {
              ...initialSet,
              ...set,
            },
            (err, result) => (err ? reject(err) : resolve(result.insertedId))
          )
        )
    );

    if (response) {
      return <string>response;
    }

    return null;
  } catch (e) {
    debug("db:sets", true)("ERROR", e);
    return null;
  }
};

export const updateSet = async (set: OptionalSet): Promise<Set | null> => {
  try {
    const response = await run((db) =>
      db.collection(COLLECTION).updateOne({ _id: set._id }, { $set: set })
    );

    if (response) {
      return <Set>response;
    }

    return null;
  } catch (e) {
    return null;
  }
};

export const fetchAll = async (): Promise<Set[]> => {
  try {
    const response = await run((db) =>
      db.collection(COLLECTION).find({}).toArray()
    );

    if (response) {
      return <Set[]>response;
    }

    return [];
  } catch (e) {
    return [];
  }
};
