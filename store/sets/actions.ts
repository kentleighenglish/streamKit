import {
  initSetType,
  loadSetType,
  updateSetsType,
  addLayerType,
  deleteLayerType,
  addSlideType,
  deleteSlideType,
  setActiveCellType,
  resetActiveCellType,
  updateActiveCellType,
  saveSetType,
  saveSetCompleteType,
  updateRecentlySavedType,
  Store,
} from "@/types/store";
import { Set, Cell } from "@/types/sets";

import { loadedSet } from "./getters";

let saveTimeout: ReturnType<typeof setTimeout>;

export const initSet = ({ commit }: Store) => {
  commit(initSetType);
};

export const updateSets = ({ commit }: Store, sets: Set[]) => {
  commit(updateSetsType, sets);
};

export const createSet = async ({ dispatch, rootState }: Store, set: Set) => {
  const { socket } = rootState.socket;

  await new Promise<void>((resolve) => {
    socket.emit("CREATE", set, (newSetId: string) => {
      dispatch("loadSet", newSetId);
      resolve();
    });
  });
};

export const loadSet = ({ commit }: Store, set: Set) => {
  commit(loadSetType, set);
};

export const addLayer = ({ commit, dispatch }: Store) => {
  commit(addLayerType);

  dispatch("updateCurrentSet");
};
export const deleteLayer = ({ commit, dispatch }: Store, index: number) => {
  commit(deleteLayerType, index);

  dispatch("updateCurrentSet");
};

export const addSlide = ({ commit, dispatch }: Store) => {
  commit(addSlideType);

  dispatch("updateCurrentSet");
};

export const deleteSlide = ({ commit, dispatch }: Store, index: number) => {
  commit(deleteSlideType, index);

  dispatch("updateCurrentSet");
};

export const setActiveCell = (
  { commit }: Store,
  { layer, slide }: { layer: number; slide: number }
) => {
  commit(setActiveCellType, { layer, slide });
};

export const resetActiveCell = ({ commit }: Store) => {
  commit(resetActiveCellType);
};

export const updateActiveCell = ({ commit, dispatch }: Store, cell: Cell) => {
  commit(updateActiveCellType, cell);

  dispatch("updateCurrentSet");
};

export const updateCurrentSet = ({ commit, state, rootState }: Store) => {
  // Prevent update from occurring immediately after changes
  clearTimeout(saveTimeout);

  saveTimeout = setTimeout(() => {
    // Only save again if not saved recently
    if (!state._recentlySaved) {
      commit(updateRecentlySavedType, true);
      const { socket } = rootState;
      const set = loadedSet(state);

      commit(saveSetType);
      socket.emit("UPDATE", set, () => {
        commit(saveSetCompleteType);
        setTimeout(() => {
          commit(updateRecentlySavedType, false);
        }, 3000);
      });
    }
  }, 1000);
};
