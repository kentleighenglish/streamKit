import { SetsState } from "@/types/store";
import { Set, OptionalSet } from "@/types/sets";

export const loadedSet = ({ sets, currentSet }: SetsState): OptionalSet => {
  return sets.find((s: Set) => s._id === currentSet) || {};
};
