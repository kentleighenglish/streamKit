import Vue from "vue";
import {
  addSocketType,
  updateSocketStatusType,
  updateDevicesType,
  addAlertType,
  removeAlertType,
  clearAlertsType,
  RootState,
  SocketStatus,
  Alert,
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
  [addAlertType](
    state: RootState,
    { group, alert }: { group: string; alert: Alert }
  ) {
    Vue.set(state.alerts, group, [...(state.alerts[group] || []), alert]);
  },
  [removeAlertType](
    state: RootState,
    { group, id }: { group: string; id: string }
  ) {
    if (state.alerts[group]) {
      const updatedAlerts = state.alerts[group].reduce(
        (arr: Alert[], alert: Alert) =>
          alert.id === id ? arr : [...arr, alert],
        []
      );

      Vue.set(state.alerts, group, updatedAlerts);
    }
  },
  [clearAlertsType](
    state: RootState,
    {
      group,
      clearMessages,
      clearErrors,
    }: { group: string; clearMessages?: boolean; clearErrors?: boolean }
  ) {
    const newAlerts = (state.alerts[group] || []).reduce(
      (acc: Alert[], alert: Alert) => {
        if (clearMessages && clearErrors) {
          return acc;
        }

        if (
          (!clearErrors && alert.type === "error") ||
          (!clearMessages && alert.type !== "error")
        ) {
          return [...acc, alert];
        }

        return acc;
      },
      []
    );

    Vue.set(state.alerts, group, newAlerts);
  },
};
