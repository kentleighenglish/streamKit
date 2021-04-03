import Vue from "vue";
import { cloneDeep, findIndex } from "lodash";
import createLogger from 'vuex/dist/logger'
import debugFunc from "debug";

export const MUTATION_TYPES = {
  INIT_SET: '@SETS/INIT_SET',
  UPDATE_SETS: "@SETS/UPDATE_SETS",
  CREATE_SET: "@SETS/CREATE_SET",
  LOAD_SET: "@SETS/LOAD_SET",
  ADD_LAYER: "@SETS/ADD_LAYER",
  DELETE_LAYER: "@SETS/DELETE_LAYER",
  ADD_SLIDE: "@SETS/ADD_SLIDE",
  DELETE_SLIDE: "@SETS/DELETE_SLIDE",
  SET_ACTIVE_CELL: "@SETS/SET_ACTIVE_CELL",
  RESET_ACTIVE_CELL: "@SETS/RESET_ACTIVE_CELL",
  UPDATE_ACTIVE_CELL: "@SETS/UPDATE_ACTIVE_CELL",
  SAVE_SET: "@SETS/SAVE",
  SAVE_SET_COMPLETE: "@SETS/SAVE_COMPLETE",
  UPDATE_RECENT_SAVED: "@SETS/UPDATE_RECENT_SAVED"
}

const saveTimeout = null;

export const state = () => ({
  currentSet: null,
	currentCell: {
		layer: null,
		slide: null
	},
	loadedSet: {},
	sets: [],
	loaded: false,
	saving: false,
  _recentlySaved: false,
});

export const actions = {
	openModal: ({ commit, state }, modal) => {
		commit(MUTATION_TYPES.OPEN_MODAL, { modal });
	},
  initSet: ({ commit }) => {
    commit(MUTATION_TYPES.INIT_SET);
  },
  updateSets: ({ commit }, sets) => {
    commit(MUTATION_TYPES.UPDATE_SETS, sets);
  },
  createSet: async ({ dispatch, rootState }, set) => {
    const { socket } = rootState.socket;

    await new Promise((resolve) => {
      socket.emit("CREATE", set, (newSet) => {
        dispatch("loadSet", newSet);
        resolve();
      });
    });
  },
  loadSet: ({ commit }, set) => {
    commit(MUTATION_TYPES.LOAD_SET, set);
  },
  addLayer: ({ commit, dispatch }) => {
  	commit(MUTATION_TYPES.ADD_LAYER)

  	dispatch("updateCurrentSet");
  },
  deleteLayer: ({ commit, dispatch }, index) => {
  	commit(MUTATION_TYPES.DELETE_LAYER, index);

  	dispatch("updateCurrentSet");
  },
  addSlide: ({ commit, dispatch }) => {
  	commit(MUTATION_TYPES.ADD_SLIDE);

  	dispatch("updateCurrentSet");
  },
  deleteSlide: ({ commit, dispatch }, index) => {
  	commit(MUTATION_TYPES.DELETE_SLIDE, index);

  	dispatch("updateCurrentSet");
  },
  setActiveCell: ({ commit }, { layer, slide }) => {
  	commit(MUTATION_TYPES.SET_ACTIVE_CELL, { layer, slide });
  },
  resetActiveCell: ({ commit }) => {
  	commit(MUTATION_TYPES.RESET_ACTIVE_CELL);
  },
  updateActiveCell: ({ commit, dispatch }, cell) => {
  	commit(MUTATION_TYPES.UPDATE_ACTIVE_CELL, cell);

  	dispatch("updateCurrentSet");
  },
  updateCurrentSet: ({ commit, state, rootState }) => {
  	// Prevent update from occurring immediately after changes
  	clearTimeout(saveTimeout);

  	saveTimeout = setTimeout(() => {
  		// Only save again if not saved recently
  		if (!state._recentlySaved) {
  			commit(MUTATION_TYPES.UPDATE_RECENT_SAVED, true);
  			const { socket } = rootState;

  			commit(MUTATION_TYPES.SAVE_SET);
  			socket.emit("UPDATE", state.loadedSet, () => {
  				commit(MUTATION_TYPES.SAVE_SET_COMPLETE);
  				setTimeout(() => {
  					commit(MUTATION_TYPES.UPDATE_RECENT_SAVED, false);
  				}, 3000)
  			});
  		}
  	}, 1000);
  }

};

export const mutations = {
	[MUTATION_TYPES.OPEN_MODAL]: function(state, { modal }) {
		Vue.set(state, "visibleModal", modal);
	},
  [MUTATION_TYPES.INIT_SET]: function(state) {
    const currentSet = sessionStorage.getItem("currentSet");
    const currentCell = sessionStorage.getItem("currentCell");

    if (currentSet) {
      Vue.set(state, "currentSet", currentSet);
    }
    if (currentCell) {
      Vue.set(state, "currentCell", JSON.parse(currentCell));
    }
  },
  [MUTATION_TYPES.LOAD_SET]: function(state, set) {
    Vue.set(state, "currentSet", set);
    sessionStorage.setItem("currentSet", set);
  },
  [MUTATION_TYPES.UNLOAD_SET]: function(state) {
    Vue.set(state, "currentSet", null);
  },
  [MUTATION_TYPES.UPDATE_SETS]: function(state, sets) {
    Vue.set(state, "sets", sets);
    Vue.set(state, "loaded", true);
  },
  [MUTATION_TYPES.ADD_LAYER]: function(state) {
    Vue.set(state, updateCurrentSet(state, {
      layers: state.loadedSet.layers + 1
    }));
  },
  [MUTATION_TYPES.DELETE_LAYER]: function(state, layer) {
    const deletedLayer = layer;
    const { layers, cells } = state.loadedSet;

    Vue.set(state, updateCurrentSet(state, {
      layers: layers > 1 ? layers - 1 : 1,
      cells: cells.reduce((arr, cell) => {
        if (cell.layer === deletedLayer) {
          return arr;
        }

        if (cell.layer > deletedLayer) {
          cell.layer = cell.layer--;
        }

        return [...arr, cell];
      }, [])
    }));
  },
  [MUTATION_TYPES.ADD_SLIDE]: function(state) {
    Vue.set(state, updateCurrentSet(state, {
      slides: state.loadedSet.slides + 1
    }));
  },
  [MUTATION_TYPES.DELETE_SLIDE]: function(state, payload) {
    const deletedSlide = action.payload;
    const { slides, cells } = state.loadedSet;

    state = updateCurrentSet(state, {
      slides: slides > 1 ? slides - 1 : 1,
      cells: cells.reduce((arr, cell) => {
        if (cell.slide === deletedSlide) {
          return arr;
        }

        if (cell.slide > deletedLayer) {
          cell.slide = cell.slide--;
        }

        return [...arr, cell];
      }, [])
    });
  },
  [MUTATION_TYPES.SET_ACTIVE_CELL]: function(state, payload) {
    const { layer, slide } = action.payload;

    state.currentCell.layer = layer;
    state.currentCell.slide = slide;

    sessionStorage.setItem("currentCell", JSON.stringify(state.currentCell));
  },
  [MUTATION_TYPES.RESET_ACTIVE_CELL]: function(state, payload) {
    // @todo clear the active cell if the layer or slide it was in is deleted;
  },
  [MUTATION_TYPES.UPDATE_ACTIVE_CELL]: function(state, cell) {
    const { currentCell, loadedSet } = state;

    if (currentCell.layer !== null && currentCell.slide !== null) {
      const cells = loadedSet.cells;
      const existingSlideIndex = findIndex(cells, { layer: currentCell.layer, slide: currentCell.slide });

      const newCell = existingSlideIndex !== -1 ? {
        ...cells[existingSlideIndex],
        ...cell
      } : cell;

      if (existingSlideIndex !== -1) {
        cells[existingSlideIndex] = newCell;
      } else {
        cells.push(newCell);
      }

      Vue.set(state, updateCurrentSet(state, {
        cells
      }));
    }
  },
  [MUTATION_TYPES.SAVE_SET]: function(state) {
    Vue.set(state, "saving", true);
  },
  [MUTATION_TYPES.SAVE_SET_COMPLETE]: function(state) {
    Vue.set(state, "saving", false);
  }
}

const getCurrentSet = state => {
	return (state.sets.find(s => s.id === state.currentSet) || {});
}

const updateCurrentSet = (state, set) => {
	const index = state.sets.findIndex(s => s.id === state.currentSet);

	if (index !== -1) {
		state.sets[index] = {
			...state.sets[index],
			...set
		};
	}

	return state;
}
