import { addSocketType, updateDevicesType } from "./constants";
import { Device, Socket, Store } from "./interfaces";

export const addSocket = ({ commit }: Store, socket: Socket) => {
  commit(addSocketType, socket);
};

export const updateDevices = ({ commit }: Store, devices: Device[]) => {
  commit(updateDevicesType, devices);
};
