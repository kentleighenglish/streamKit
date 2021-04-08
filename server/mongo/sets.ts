import { Set, OptionalSet } from "@/types/sets";
import { Db } from "mongodb";
import { run } from "./_utils";

const COLLECTION = "sets";

const initialSet: OptionalSet = {
  layers: 1,
  slides: 1,
  cells: [],
};

export const createSet = async (set: OptionalSet): Promise<Set | null> => {
  try {
    const response = await run((db) =>
      db.collection(COLLECTION).insertOne({
        ...initialSet,
        ...set,
      })
    );

    if (response && response.id) {
      return <Set>response;
    }

    return null;
  } catch (e) {
    return null;
  }
};

export const updateSet = async (set: OptionalSet): Promise<Set | null> => {
  try {
    const response = await run((db) =>
      db.collection(COLLECTION).updateOne({ id: set.id }, set)
    );

    if (response) {
      console.log(response);
      return <Set>response;
    }

    return null;
  } catch (e) {
    return null;
  }
};

export const fetchAll = async (set: OptionalSet): Promise<Set[]> => {
  try {
    const response = await run((db) =>
      db.collection(COLLECTION).find({}).toArray()
    );

    if (response) {
      return response;
    }

    return [];
  } catch (e) {
    return [];
  }
};
