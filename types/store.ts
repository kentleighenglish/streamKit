import { Device, SocketClientInstance } from "./socket";
import { Set } from "./sets";

export interface SetsState {
  currentSetId: string | null;
  currentSet: Set | null;
  currentCell: {
    layer: number | null;
    slide: number | null;
  };
  sets: Set[];
  loaded: boolean;
  saving: boolean;
  _recentlySaved: boolean;
}

export interface SocketStatus {
  socket: () => SocketClientInstance;
  connected: boolean;
  error?: string | null;
}

export interface Alert {
  id?: string;
  message: string;
  group: string;
  type?: string;
  note?: boolean;
  timeout?: number;
  timestamp?: string | boolean;
}

export interface RootState {
  devices: Device[];
  socket: SocketStatus;
  sets: SetsState;
  alerts: { [key: string]: Alert[] };
}

export type StoreCommit = (type: string, payload?: any) => void;
export type StoreDispatch = (type: string, payload?: any, options?: any) => any;

export interface Store {
  commit: StoreCommit;
  dispatch: StoreDispatch;
  state: any;
  rootState: RootState;
}

// Mutation Types
export const updateDevicesType = "@updateDevices";
export const addSocketType = "@addSocket";
export const updateSocketStatusType = "@updateSocketStatus";
export const addAlertType = "@addAlert";
export const removeAlertType = "@removeAlert";
export const clearAlertsType = "@clearAlerts";

// Sets Types
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
export const updateCurrentSetType = "@sets/updateCurrentSet";
