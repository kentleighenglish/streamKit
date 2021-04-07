import { Device, SocketClientInstance } from "@/types/socket";
import { RootState, addSocketType, updateDevicesType } from "@/types/store";

export interface Store {
  commit: (type: string, payload?: any) => void;
  dispatch: (type: string, payload?: any) => any;
  state: RootState;
  rootState: any;
}

export const addSocket = (
  { commit }: Store,
  socket: () => SocketClientInstance
) => {
  commit(addSocketType, socket);
};

export const updateDevices = ({ commit }: Store, devices: Device[]) => {
  commit(updateDevicesType, devices);
};
