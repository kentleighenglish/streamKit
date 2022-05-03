import {
  initSetType,
  loadSetType,
  updateSetsType,
  addLayerType,
  deleteLayerType,
  addSlideType,
  deleteSlideType,
  setActiveCellType,
  updateActiveCellType,
  saveSetType,
  saveSetCompleteType,
  updateRecentlySavedType,
  Store,
} from "@/types/store";
import { socketEvents } from "@/types/socket";
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
    socket().emit(socketEvents.client.CREATE_SET, set, (newSet: Set) => {
      dispatch("loadSet", newSet);
      resolve();
    });
  });
};

export const loadSet = ({ commit }: Store, _id: string) => {
  commit(loadSetType, _id);
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
      const { socket } = rootState.socket;
      const set = loadedSet(state);

      commit(saveSetType);
      socket().emit(socketEvents.client.UPDATE_SET, set, () => {
        commit(saveSetCompleteType);
        setTimeout(() => {
          commit(updateRecentlySavedType, false);
        }, 3000);
      });
    }
  }, 1000);
};
