import { Socket } from "socket.io-client";
import { Device } from "./socket";
import { Set } from "./sets";

export interface SetsState {
  currentSet: string | null;
  currentCell: {
    layer: number | null;
    slide: number | null;
  };
  sets: Set[];
  loaded: boolean;
  saving: boolean;
  _recentlySaved: boolean;
}

export interface RootState {
  devices: Device[];
  socket: Socket;
  sets: SetsState;
}

export interface Store {
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => any;
  state: any;
  rootState: any;
}

// Mutation Types
export const updateDevicesType = "@updateDevices";
export const addSocketType = "@addSocket";

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
