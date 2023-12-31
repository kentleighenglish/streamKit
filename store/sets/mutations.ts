import Vue from "vue";
import { findIndex } from "lodash";
import { OptionalSet, Set, Cell } from "@/types/sets";
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
  updateCurrentSetType,
  SetsState,
} from "@/types/store";

const updateCurrentSet = (state: SetsState, set: OptionalSet): Set[] => {
  const index = state.sets.findIndex((s: Set) => s._id === state.currentSetId);

  if (index !== -1) {
    state.sets[index] = {
      ...state.sets[index],
      ...set,
    };
  }

  return state.sets;
};

export const getCurrentSet = ({
  sets,
  currentSetId,
}: SetsState): OptionalSet => {
  return sets.find((s: Set) => s._id === currentSetId) || {};
};

export default {
  [initSetType](state: SetsState) {
    const currentSetId = sessionStorage.getItem("currentSetId");
    const currentCell = sessionStorage.getItem("currentCell");

    if (currentSetId) {
      Vue.set(state, "currentSetId", currentSetId);
    }
    if (currentCell) {
      Vue.set(state, "currentCell", JSON.parse(currentCell));
    }
  },
  [loadSetType](state: SetsState, setId: string) {
    Vue.set(state, "currentSetId", setId);
    sessionStorage.setItem("currentSetId", setId);
  },
  [unloadSetType](state: SetsState) {
    Vue.set(state, "currentSetId", null);
  },
  [updateSetsType](state: SetsState, sets: Set[]) {
    Vue.set(state, "sets", sets);
    Vue.set(state, "loaded", true);
  },
  [addLayerType](state: SetsState) {
    const set = getCurrentSet(state);
    const sets = updateCurrentSet(state, { layers: set.layers + 1 });

    Vue.set(state, "sets", sets);
  },
  [deleteLayerType](state: SetsState, layer: number) {
    const deletedLayer = layer;
    const { layers, cells } = getCurrentSet(state);

    const sets = updateCurrentSet(state, {
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

    Vue.set(state, "sets", sets);
  },
  [addSlideType](state: SetsState) {
    const set = getCurrentSet(state);

    const sets = updateCurrentSet(state, {
      slides: set.slides + 1,
    });

    Vue.set(state, "sets", sets);
  },
  [deleteSlideType](state: SetsState, deletedSlide: number) {
    const { slides, cells } = getCurrentSet(state);

    const sets = updateCurrentSet(state, {
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

    Vue.set(state, "sets", sets);
  },
  [setActiveCellType](
    state: SetsState,
    { layer, slide }: { layer: number; slide: number }
  ) {
    state.currentCell.layer = layer;
    state.currentCell.slide = slide;

    sessionStorage.setItem("currentCell", JSON.stringify(state.currentCell));
  },
  [resetActiveCellType](
    state: SetsState,
    {
      deletedSlide,
      deletedLayer,
    }: { deletedSlide?: number; deletedLayer?: number }
  ) {
    const { currentCell } = state;

    if (
      currentCell.slide === deletedSlide ||
      currentCell.layer === deletedLayer
    ) {
      Vue.set(state.currentCell, "slide", null);
      Vue.set(state.currentCell, "layer", null);
    }
  },
  [updateActiveCellType](state: SetsState, cell: Cell) {
    const { currentCell } = state;
    const set = getCurrentSet(state);

    if (currentCell.layer !== null && currentCell.slide !== null) {
      const cells = set.cells || [];
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

      const sets = updateCurrentSet(state, { cells });
      Vue.set(state, "sets", sets);
    }
  },
  [saveSetType](state: SetsState) {
    Vue.set(state, "saving", true);
  },
  [saveSetCompleteType](state: SetsState) {
    Vue.set(state, "saving", false);
  },
  [updateRecentlySavedType](state: SetsState, recentlySaved: boolean) {
    Vue.set(state, "_recentlySaved", recentlySaved);
  },
  [updateCurrentSetType](state: SetsState) {
    Vue.set(state, "currentSet", getCurrentSet(state));
  },
};
