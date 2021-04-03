import { Set, OptionalSet, State } from "./interfaces";

export const loadedSet = ({ sets, currentSet }: State): OptionalSet => {
  return sets.find((s: Set) => s.id === currentSet) || {};
};
