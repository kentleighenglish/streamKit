import Vue from "vue";
import {
  addSocketType,
  updateSocketStatusType,
  updateDevicesType,
  RootState,
  SocketStatus,
} from "@/types/store";
import { Device, SocketClientInstance } from "@/types/socket";

export default {
  [addSocketType](state: RootState, socket: SocketClientInstance) {
    Vue.set(state.socket, "socket", socket);
  },
  [updateSocketStatusType](state: RootState, socketStatus: SocketStatus) {
    state.socket = { ...state.socket, ...socketStatus };
  },
  [updateDevicesType](state: RootState, devices: Device[]) {
    Vue.set(state, "devices", devices);
  },
};
