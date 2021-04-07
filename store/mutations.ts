import Vue from "vue";
import { Socket } from "socket.io-client";
import { addSocketType, updateDevicesType, RootState } from "@/types/store";
import { Device } from "@/types/socket";

export default {
  [addSocketType](state: RootState, socket: Socket) {
    Vue.set(state, "socket", socket);
  },
  [updateDevicesType](state: RootState, devices: Device[]) {
    Vue.set(state, "devices", devices);
  },
};
