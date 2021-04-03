export const state = () => ({
  currentSet: null,
  currentCell: {
    layer: null,
    slide: null,
  },
  loadedSet: {},
  sets: [],
  loaded: false,
  saving: false,
  _recentlySaved: false,
});

export const initSetType = "@sets/initSet";
export const updateSetsType = "@sets/updateSets";
export const createSetType = "@sets/createSet";
export const loadSetType = "@sets/loadSet";
export const unloadSetType = "@sets/unloadSet";
export const addLayerType = "@sets/addLayer";
export const deleteLayerType = "@sets/deleteLayer";
export const addSlideType = "@sets/addSlide";
export const deleteSlideType = "@sets/deleteSlide";
export const setActiveCellType = "@sets/setActiveCell";
export const resetActiveCellType = "@sets/resetActiveCell";
export const updateActiveCellType = "@sets/updateActiveCell";
export const saveSetType = "@sets/save";
export const saveSetCompleteType = "@sets/saveComplete";
export const updateRecentlySavedType = "@sets/updateRecentlySaved";
