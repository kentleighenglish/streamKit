import { Device, SocketClientInstance } from "@/types/socket";
import {
  Store,
  SocketStatus,
  addSocketType,
  updateDevicesType,
  updateSocketStatusType,
} from "@/types/store";

export const addSocket = (
  { commit, dispatch }: Store,
  socket: () => SocketClientInstance
) => {
  commit(addSocketType, socket);

  const io: SocketClientInstance = socket();

  dispatch("bindEvents", io, { root: true });
};

export const updateSocketStatus = (
  { commit }: Store,
  socketStatus: SocketStatus
) => {
  commit(updateSocketStatusType, socketStatus);
};

export const updateDevices = ({ commit }: Store, devices: Device[]) => {
  commit(updateDevicesType, devices);
};

export const bindEvents = ({ commit }: Store, io: SocketClientInstance) => {
  io.on("connect", () => {
    commit(updateSocketStatusType, {
      connected: true,
    });
  });
  io.on("connect_error", (error: Error) => {
    commit(updateSocketStatusType, {
      connected: false,
      error: error.message,
    });
  });
  io.on("disconnect", (reason: string) => {
    commit(updateSocketStatusType, {
      connected: false,
      error: reason,
    });
  });
};
