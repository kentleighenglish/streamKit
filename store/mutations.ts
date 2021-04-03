import Vue from "vue";
import { addSocketType, updateDevicesType, RootState } from "@/types/store";
import { Socket, Device } from "@/types/socket";

export default {
  [addSocketType](state: RootState, socket: Socket) {
    Vue.set(state, "socket", socket);
  },
  [updateDevicesType](state: RootState, devices: Device[]) {
    Vue.set(state, "devices", devices);
  },
};
