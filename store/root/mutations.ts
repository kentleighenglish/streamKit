import Vue from "vue";
import { addSocketType, updateDevicesType } from "./constants";
import { State, Socket, Device } from "./interfaces";

export const mutations = {
  [addSocketType](state: State, socket: Socket) {
    Vue.set(state, "socket", socket);
  },
  [updateDevicesType](state: State, devices: Device[]) {
    Vue.set(state, "devices", devices);
  },
};
