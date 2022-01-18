import { Set } from "@/types/sets";
import { Device, SocketClientInstance, socketEvents } from "@/types/socket";
import {
  Store,
  SocketStatus,
  Alert,
  addSocketType,
  updateDevicesType,
  updateSocketStatusType,
  addAlertType,
  removeAlertType,
  clearAlertsType,
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

export const bindEvents = (
  { commit, dispatch }: Store,
  io: SocketClientInstance
) => {
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

  io.on(socketEvents.server.UPDATE_SETS, (sets: Set[]) => {
    dispatch("sets/updateSets", sets, { root: true });
  });
};

export const addAlert = (
  { commit }: Store,
  { group = "global", ...alert }: Alert
) => {
  commit(clearAlertsType, { group });

  const timestamp = String(new Date().valueOf());
  const id = btoa(`${timestamp}:${alert.message}`);

  commit(addAlertType, { group, alert: { id, timestamp, ...alert } });
};

export const removeAlert = (
  { commit }: Store,
  { group, id }: { group: string; id: string }
) => {
  commit(removeAlertType, { group, id });
};

export const clearAlerts = (
  { commit }: Store,
  {
    group,
    clearMessages = true,
    clearErrors = true,
  }: { group: string; clearMessages?: boolean; clearErrors?: boolean }
) => {
  commit(clearAlertsType, { group, clearMessages, clearErrors });
};
