import Vue from "vue";
import { findIndex } from "lodash";
import { OptionalSet, Set, State, Cell } from "./interfaces";
import {
  initSetType,
  loadSetType,
  unloadSetType,
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
} from "./constants";

const updateCurrentSet = (state: State, set: OptionalSet): State => {
  const index = state.sets.findIndex((s: Set) => s.id === state.currentSet);

  if (index !== -1) {
    state.sets[index] = {
      ...state.sets[index],
      ...set,
    };
  }

  return state;
};

const getCurrentSet = (state: State): Set => {
  const index = state.sets.findIndex((s: Set) => s.id === state.currentSet);

  return state.sets[index];
};

export default {
  [initSetType](state: State) {
    const currentSet = sessionStorage.getItem("currentSet");
    const currentCell = sessionStorage.getItem("currentCell");

    if (currentSet) {
      Vue.set(state, "currentSet", currentSet);
    }
    if (currentCell) {
      Vue.set(state, "currentCell", JSON.parse(currentCell));
    }
  },
  [loadSetType](state: State, setId: string) {
    Vue.set(state, "currentSet", setId);
    sessionStorage.setItem("currentSet", setId);
  },
  [unloadSetType](state: State) {
    Vue.set(state, "currentSet", null);
  },
  [updateSetsType](state: State, sets: Set[]) {
    Vue.set(state, "sets", sets);
    Vue.set(state, "loaded", true);
  },
  [addLayerType](state: State) {
    const loadedSet = getCurrentSet(state);
    state = updateCurrentSet(state, { layers: loadedSet.layers + 1 });
  },
  [deleteLayerType](state: State, layer: number) {
    const deletedLayer = layer;
    const { layers, cells } = getCurrentSet(state);

    state = updateCurrentSet(state, {
      layers: layers > 1 ? layers - 1 : 1,
      cells: cells.reduce((arr: Cell[], cell: Cell) => {
        if (cell.layer === deletedLayer) {
          return arr;
        }

        if (cell.layer > deletedLayer) {
          cell.layer = cell.layer--;
        }

        return [...arr, cell];
      }, []),
    });
  },
  [addSlideType](state: State) {
    const loadedSet = getCurrentSet(state);

    state = updateCurrentSet(state, {
      slides: loadedSet.slides + 1,
    });
  },
  [deleteSlideType](state: State, deletedSlide: number) {
    const { slides, cells } = getCurrentSet(state);

    state = updateCurrentSet(state, {
      slides: slides > 1 ? slides - 1 : 1,
      cells: cells.reduce((arr: Cell[], cell: Cell) => {
        if (cell.slide === deletedSlide) {
          return arr;
        }

        if (cell.slide > deletedSlide) {
          cell.slide = cell.slide--;
        }

        return [...arr, cell];
      }, []),
    });
  },
  [setActiveCellType](
    state: State,
    { layer, slide }: { layer: number; slide: number }
  ) {
    state.currentCell.layer = layer;
    state.currentCell.slide = slide;

    sessionStorage.setItem("currentCell", JSON.stringify(state.currentCell));
  },
  [resetActiveCellType](state: State) {
    // @todo clear the active cell if the layer or slide it was in is deleted;
  },
  [updateActiveCellType](state: State, cell: Cell) {
    const { currentCell } = state;
    const loadedSet = getCurrentSet(state);

    if (currentCell.layer !== null && currentCell.slide !== null) {
      const cells = loadedSet.cells;
      const existingSlideIndex = findIndex(cells, {
        layer: currentCell.layer,
        slide: currentCell.slide,
      });

      const newCell =
        existingSlideIndex !== -1
          ? {
              ...cells[existingSlideIndex],
              ...cell,
            }
          : cell;

      if (existingSlideIndex !== -1) {
        cells[existingSlideIndex] = newCell;
      } else {
        cells.push(newCell);
      }

      state = updateCurrentSet(state, { cells });
    }
  },
  [saveSetType](state: State) {
    Vue.set(state, "saving", true);
  },
  [saveSetCompleteType](state: State) {
    Vue.set(state, "saving", false);
  },
  [updateRecentlySavedType](state: State, recentlySaved: boolean) {
    Vue.set(state, "_recentlySaved", recentlySaved);
  },
};
